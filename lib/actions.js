// lib/actions.js
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

// ✅ حذف کت شلوار (فقط ادمین)
export async function deleteSuitAction(formData) {
    // بررسی ادمین بودن کاربر
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }

    const id = formData.get("id");

    if (!id) {
        throw new Error("Suit ID is required");
    }

    // حذف از Supabase
    const { error } = await supabase.from("suits").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/account/management");
    return { success: true };
}

// ✅ آپدیت پروفایل کاربر
export async function updateProfileAction(formData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const phone = formData.get("phone");
    const description = formData.get("description");
    const address = formData.get("address");
    const building_number = formData.get("building_number");
    const postal_code = formData.get("postal_code");
    const unit = formData.get("unit");

    // آپدیت در Supabase
    const { error } = await supabase
        .from("users")
        .update({
            phone: phone || null,
            description: description || null,
            address: address || null,
            building_number: building_number || null,
            postal_code: postal_code || null,
            unit: unit || null,
        })
        .eq("id", user.id);

    if (error) throw new Error(error.message);

    revalidatePath("/account/profile");
    return { success: true };
}

// ✅ خروج از حساب (موجود)
export async function signOutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true };
}

// ✅ حذف کامل حساب کاربری (با Supabase)
export async function deleteAccountAction() {
    try {
        // 1. دریافت کاربر فعلی
        const user = await getCurrentUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        // 2. حذف سفارشات کاربر
        const { error: ordersError } = await supabase
            .from("orders")
            .delete()
            .eq("user_id", user.id);

        if (ordersError) console.error("Orders delete error:", ordersError);

        // 3. حذف آیتم‌های سفارشات کاربر (به صورت جداگانه اگر لازم باشد)
        // ابتدا سفارشات کاربر را پیدا کن
        const { data: userOrders } = await supabase
            .from("orders")
            .select("id")
            .eq("user_id", user.id);

        if (userOrders && userOrders.length > 0) {
            const orderIds = userOrders.map((order) => order.id);

            // حذف آیتم‌های سفارشات
            const { error: itemsError } = await supabase
                .from("order_items")
                .delete()
                .in("order_id", orderIds);

            if (itemsError)
                console.error("Order items delete error:", itemsError);
        }

        // 4. حذف کاربر از دیتابیس
        const { error: userError } = await supabase
            .from("users")
            .delete()
            .eq("id", user.id);

        if (userError) throw new Error(userError.message);

        // 5. پاک کردن سشن (کوکی)
        const cookieStore = await cookies();
        cookieStore.delete("auth-token");

        // 6. ریدایرکت به صفحه اصلی
        redirect("/");
    } catch (error) {
        console.error("Delete account error:", error);
        throw new Error("Failed to delete account");
    }
}
    