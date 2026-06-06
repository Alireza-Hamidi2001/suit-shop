// app/api/admin/suits/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

        // آپدیت در Supabase
        const { error } = await supabase
            .from("suits")
            .update({
                name,
                price,
                discount: discount || 0,
                description: description || null,
                fabric: fabric || null,
                category: category || "male",
                image: image || null,
            })
            .eq("id", id);

        if (error) {
            console.error("Supabase update error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json({
            success: true,
            message: "Suit updated successfully",
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

// GET برای دریافت یک محصول
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const { data, error } = await supabase
            .from("suits")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: "Suit not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(data);
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

        // حذف از Supabase
        const { error } = await supabase.from("suits").delete().eq("id", id);

        if (error) {
            console.error("Supabase delete error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json({
            success: true,
            message: "Suit deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
