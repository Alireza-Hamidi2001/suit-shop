// app/api/comments/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

// GET - دریافت نظرات بر اساس پارامترها (عمومی - بدون نیاز به لاگین)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const suitId = searchParams.get("suitId");
        const approved = searchParams.get("approved") === "true";
        const pending = searchParams.get("pending") === "true";

        let query = supabase.from("comments").select(`
            id,
            comment,
            rating,
            created_at,
            fullname,
            email,
            suit_id,
            is_approved,
            users:user_id (fullname, avatar, email)
        `);

        if (suitId) {
            query = query.eq("suit_id", parseInt(suitId));
        }

        if (approved) {
            query = query.eq("is_approved", true);
        }

        if (pending) {
            query = query.eq("is_approved", false);
        }

        const { data, error } = await query.order("created_at", {
            ascending: false,
        });

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error) {
        console.error("GET comments error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - ایجاد نظر جدید (عمومی - هر کسی می‌تواند نظر بدهد)
export async function POST(request) {
    try {
        const body = await request.json();
        const { suitId, userId, fullname, email, comment, rating } = body;

        if (!suitId || !comment) {
            return NextResponse.json(
                { error: "suitId and comment are required" },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("comments")
            .insert([
                {
                    suit_id: suitId,
                    user_id: userId || null,
                    fullname: fullname || "Anonymous",
                    email: email || null,
                    comment: comment,
                    rating: rating || null,
                    is_approved: false,
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            { success: true, comment: data },
            { status: 201 },
        );
    } catch (error) {
        console.error("POST comment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - تایید نظر (فقط ادمین)
export async function PATCH(request) {
    try {
        // ✅ بررسی ادمین بودن کاربر
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 },
            );
        }

        const body = await request.json();
        const { id, is_approved } = body;

        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 },
            );
        }

        const { error } = await supabase
            .from("comments")
            .update({ is_approved: is_approved === true })
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH comment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - حذف نظر (فقط ادمین)
export async function DELETE(request) {
    try {
        // ✅ بررسی ادمین بودن کاربر
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 },
            );
        }

        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", parseInt(id));

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE comment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
