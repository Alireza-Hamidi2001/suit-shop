// app/api/orders/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Please login to place order" },
                { status: 401 },
            );
        }

        // فقط کاربر معمولی
        if (user.role !== "user") {
            return NextResponse.json(
                { error: "Only regular users can place orders" },
                { status: 403 },
            );
        }

        const { suitId, quantity, price } = await request.json();

        if (!suitId || !quantity || !price) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const totalAmount = price * quantity;

        // 1. ایجاد سفارش
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([
                {
                    user_id: user.id,
                    total_amount: totalAmount,
                    status: "pending",
                    order_date: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. ایجاد آیتم سفارش
        const { error: itemError } = await supabase.from("order_items").insert([
            {
                order_id: order.id,
                suit_id: suitId,
                quantity: quantity,
                price: price,
            },
        ]);

        if (itemError) throw itemError;

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            orderId: order.id,
        });
    } catch (error) {
        console.error("Order error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
