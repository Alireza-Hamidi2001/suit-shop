// app/api/user/avatar/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        console.log("Current user:", user);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("avatar");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 },
            );
        }

        // تبدیل فایل به ArrayBuffer
        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        // نام یکتا برای فایل
        const ext = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${ext}`;
        const filePath = `${fileName}`; // مسیر در Bucket (بدون پوشه اضافه)

        // آپلود به Supabase Storage (Bucket "avatars")
        const { data, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(uploadError.message);
        }

        // دریافت URL عمومی
        const {
            data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        // به‌روز رسانی فیلد avatar در جدول users (Supabase)
        const { error: updateError } = await supabase
            .from("users")
            .update({ avatar: publicUrl })
            .eq("id", user.id);

        if (updateError) {
            console.error("Update error:", updateError);
            throw new Error(updateError.message);
        }

        return NextResponse.json({
            success: true,
            avatarUrl: publicUrl,
            message: "Avatar updated successfully",
        });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

export async function DELETE(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // دریافت avatar فعلی از دیتابیس
        const { data: userData, error: fetchError } = await supabase
            .from("users")
            .select("avatar")
            .eq("id", user.id)
            .single();

        if (fetchError) throw new Error(fetchError.message);

        const avatarUrl = userData?.avatar;
        if (avatarUrl) {
            // استخراج نام فایل از URL (فرض می‌کنیم URL مثل .../avatars/filename.ext)
            const fileName = avatarUrl.split("/").pop();
            if (fileName) {
                // حذف فایل از Storage
                const { error: deleteError } = await supabase.storage
                    .from("avatars")
                    .remove([fileName]);
                if (deleteError)
                    console.error("Storage delete error:", deleteError);
            }
        }

        // به‌روز رسانی avatar به NULL در دیتابیس
        const { error: updateError } = await supabase
            .from("users")
            .update({ avatar: null })
            .eq("id", user.id);

        if (updateError) throw new Error(updateError.message);

        return NextResponse.json({
            success: true,
            message: "Avatar deleted successfully",
        });
    } catch (error) {
        console.error("Avatar delete error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("users")
            .select("avatar")
            .eq("id", userId)
            .single();

        if (error) throw new Error(error.message);

        return NextResponse.json({ avatar: data?.avatar || null });
    } catch (error) {
        console.error("Get avatar error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
