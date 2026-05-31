// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function POST(request) {
    try {
        const { fullname, email, password, phone } = await request.json();

        // ✅ اعتبارسنجی
        if (!fullname || !email || !password) {
            return NextResponse.json(
                { error: "Fullname, email and password are required" },
                { status: 400 },
            );
        }

        // ✅ بررسی ایمیل تکراری
        const existingUser = await query(
            "SELECT id FROM users WHERE email = ?",
            [email],
        );

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 },
            );
        }

        // ✅ ذخیره در دیتابیس (نقش = 'user' نه 'guest')
        const result = await query(
            `INSERT INTO users (fullname, email, password, phone, role, created_at) 
            VALUES (?, ?, ?, ?, 'user', NOW())`, // ✅ تغییر: 'guest' → 'user'
            [fullname, email, password, phone || null],
        );

        // ✅ پاسخ موفقیت
        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                userId: result.insertId,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
