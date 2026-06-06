// app/api/admin/upload/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("image");

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
        const filename = `suit-${Date.now()}.${ext}`;
        const filePath = `${filename}`;

        // آپلود به Supabase Storage (Bucket "suit-images")
        const { data, error: uploadError } = await supabase.storage
            .from("suit-images")
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
        } = supabase.storage.from("suit-images").getPublicUrl(filePath);

        return NextResponse.json({
            success: true,
            imageUrl: publicUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
