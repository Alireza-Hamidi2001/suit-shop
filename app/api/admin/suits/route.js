// app/api/admin/suits/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
    try {
        // بررسی ادمین بودن کاربر
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 },
            );
        }

        const { name, price, discount, description, fabric, category, image } =
            await request.json();

        // اعتبارسنجی ساده
        if (!name || !price) {
            return NextResponse.json(
                { error: "Name and price are required" },
                { status: 400 },
            );
        }

        // ایجاد در دیتابیس
        const result = await query(
            `INSERT INTO suits (name, price, discount, description, fabric, category, image) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                price,
                discount || 0,
                description || null,
                fabric || null,
                category || "male",
                image || null,
            ],
        );

        return NextResponse.json({
            success: true,
            message: "Suit created successfully",
            id: result.insertId,
        });
    } catch (error) {
        console.error("Create error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET برای دریافت همه محصولات (اختیاری)
export async function GET() {
    try {
        const rows = await query("SELECT * FROM suits ORDER BY id");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Get suits error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
