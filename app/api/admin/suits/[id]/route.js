// app/api/admin/suits/[id]/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request, { params }) {
    try {
        // بررسی ادمین بودن کاربر
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 },
            );
        }

        const { id } = await params;
        const { name, price, discount, description, fabric, category, image } =
            await request.json();

        // اعتبارسنجی ساده
        if (!name || !price) {
            return NextResponse.json(
                { error: "Name and price are required" },
                { status: 400 },
            );
        }

        // آپدیت در دیتابیس
        await query(
            `UPDATE suits SET 
                name = ?, 
                price = ?, 
                discount = ?, 
                description = ?, 
                fabric = ?, 
                category = ?,
                image = ?
            WHERE id = ?`,
            [
                name,
                price,
                discount || 0,
                description || null,
                fabric || null,
                category || "male",
                image || null,
                id,
            ],
        );

        return NextResponse.json({
            success: true,
            message: "Suit updated successfully",
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET برای دریافت یک محصول (اختیاری)
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const rows = await query("SELECT * FROM suits WHERE id = ?", [id]);

        if (!rows[0]) {
            return NextResponse.json(
                { error: "Suit not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Get suit error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE برای حذف یک محصول
export async function DELETE(request, { params }) {
    try {
        // بررسی ادمین بودن کاربر
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 },
            );
        }

        const { id } = await params;

        // حذف از دیتابیس
        await query("DELETE FROM suits WHERE id = ?", [id]);

        return NextResponse.json({
            success: true,
            message: "Suit deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
