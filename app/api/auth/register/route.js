// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
        const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 },
            );
        }

        // ✅ ذخیره در Supabase
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
                {
                    fullname,
                    email,
                    password,
                    phone: phone || null,
                    role: "user",
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw insertError;
        }

        // ✅ پاسخ موفقیت
        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                userId: newUser.id,
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
