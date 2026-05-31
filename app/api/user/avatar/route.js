// app/api/user/avatar/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { query } from "@/lib/mysql";
import { getCurrentUser } from "@/lib/auth";


export async function DELETE(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // دریافت آواتار فعلی کاربر
        const rows = await query("SELECT avatar FROM users WHERE id = ?", [
            user.id,
        ]);

        const currentAvatar = rows[0]?.avatar;

        // حذف فایل از دیسک (اگر وجود داشته باشد)
        if (currentAvatar) {
            try {
                const filepath = path.join(
                    process.cwd(),
                    "public",
                    currentAvatar,
                );
                await unlink(filepath);
            } catch (err) {
                console.log("File not found or already deleted:", err.message);
            }
        }

        // آپدیت دیتابیس: ست کردن avatar به NULL
        await query("UPDATE users SET avatar = NULL WHERE id = ?", [user.id]);

        return NextResponse.json({
            success: true,
            message: "Avatar deleted successfully",
        });
    } catch (error) {
        console.error("Avatar delete error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

export async function POST(request) {
    try {
        // 1. دریافت کاربر فعلی (برای احراز هویت)
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // 2. دریافت فایل از FormData
        const formData = await request.formData();
        const file = formData.get("avatar");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        // 3. بررسی نوع فایل
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 },
            );
        }

        // 4. تبدیل فایل به بافر
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 5. ایجاد نام یکتا برای فایل
        const ext = path.extname(file.name);
        const filename = `${user.id}-${Date.now()}${ext}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
        const filepath = path.join(uploadDir, filename);

        // 6. ایجاد پوشه اگر وجود ندارد
        await mkdir(uploadDir, { recursive: true });

        // 7. ذخیره فایل در دیسک
        await writeFile(filepath, buffer);

        // 8. آدرس عمومی عکس
        const avatarUrl = `/uploads/avatars/${filename}`;

        // 9. ذخیره مسیر در دیتابیس
        await query("UPDATE users SET avatar = ? WHERE id = ?", [
            avatarUrl,
            user.id,
        ]);

        // 10. پاسخ موفقیت
        return NextResponse.json({
            success: true,
            avatarUrl,
            message: "Avatar updated successfully",
        });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// (اختیاری) GET برای دریافت آواتار
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

        const rows = await query("SELECT avatar FROM users WHERE id = ?", [
            userId,
        ]);

        return NextResponse.json({
            avatar: rows[0]?.avatar || null,
        });
    } catch (error) {
        console.error("Get avatar error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
