// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // فقط کاربر معمولی می‌تواند سفارش خود را حذف کند
        if (user.role !== "user") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        // ابتدا بررسی می‌کنیم که سفارش متعلق به این کاربر باشد
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("id, user_id")
            .eq("id", id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 },
            );
        }

        if (order.user_id !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // حذف آیتم‌های سفارش ابتدا (به دلیل Foreign Key)
        const { error: itemsError } = await supabase
            .from("order_items")
            .delete()
            .eq("order_id", id);

        if (itemsError) {
            console.error("Error deleting order items:", itemsError);
        }

        // حذف خود سفارش
        const { error: deleteError } = await supabase
            .from("orders")
            .delete()
            .eq("id", id);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE order error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
