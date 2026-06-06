// app/api/admin/suits/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

        // ایجاد در Supabase
        const { data, error } = await supabase
            .from("suits")
            .insert([
                {
                    name,
                    price: parseFloat(price),
                    discount: discount ? parseFloat(discount) : 0,
                    description: description || null,
                    fabric: fabric || null,
                    category: category || "male",
                    image: image || null,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json({
            success: true,
            message: "Suit created successfully",
            id: data.id,
        });
    } catch (error) {
        console.error("Create error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

// GET برای دریافت همه محصولات
export async function GET() {
    try {
        const { data, error } = await supabase
            .from("suits")
            .select("*")
            .order("id");

        if (error) throw new Error(error.message);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Get suits error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
