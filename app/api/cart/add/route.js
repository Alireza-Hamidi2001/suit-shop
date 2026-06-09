// app/api/cart/add/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// سبد خرید موقت (در حافظه سرور)
// در پروژه واقعی باید از دیتابیس استفاده کنی
let cartStore = {};

export async function POST(request) {
    try {
        // بررسی لاگین بودن کاربر
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Please login to add items to cart" },
                { status: 401 },
            );
        }

        // دریافت اطلاعات از درخواست
        const body = await request.json();
        const { suitId, quantity } = body;

        if (!suitId || quantity < 1) {
            return NextResponse.json(
                { error: "Invalid product data" },
                { status: 400 },
            );
        }

        // مقداردهی اولیه سبد خرید برای این کاربر
        if (!cartStore[user.id]) {
            cartStore[user.id] = [];
        }

        // بررسی وجود محصول در سبد خرید
        const existingItem = cartStore[user.id].find(
            (item) => item.suitId === suitId,
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartStore[user.id].push({ suitId, quantity });
        }

        return NextResponse.json({
            success: true,
            message: "Product added to cart successfully!",
            cart: cartStore[user.id],
        });
    } catch (error) {
        console.error("Cart error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET - دریافت سبد خرید کاربر
export async function GET(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ cart: [] });
        }

        const cart = cartStore[user.id] || [];
        return NextResponse.json({ cart });
    } catch (error) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
