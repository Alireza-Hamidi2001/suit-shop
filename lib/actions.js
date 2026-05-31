// lib/actions.js
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "./mysql";
import { getCurrentUser } from "./auth";

// lib/actions.js


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

    await query("DELETE FROM suits WHERE id = ?", [id]);
    revalidatePath("/account/management");

    return { success: true };
}

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

    await query(
        `UPDATE users SET 
            phone = ?, 
            description = ?, 
            address = ?, 
            building_number = ?, 
            postal_code = ?, 
            unit = ?
        WHERE id = ?`,
        [
            phone || null,
            description || null,
            address || null,
            building_number || null,
            postal_code || null,
            unit || null,
            user.id,
        ],
    );

    revalidatePath("/account/profile");
    return { success: true };
}

// خروج از حساب (موجود)
export async function signOutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true };
}

// ✅ حذف کامل حساب کاربری
export async function deleteAccountAction() {
    try {
        // 1. دریافت کاربر فعلی
        const user = await getCurrentUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        // 2. حذف سفارشات کاربر (به صورت آبشاری)
        await query("DELETE FROM orders WHERE user_id = ?", [user.id]);

        // 3. حذف کاربر از دیتابیس
        await query("DELETE FROM users WHERE id = ?", [user.id]);

        // 4. پاک کردن سشن (کوکی)
        const cookieStore = await cookies();
        cookieStore.delete("auth-token");

        // 5. ریدایرکت به صفحه اصلی
        redirect("/");
    } catch (error) {
        console.error("Delete account error:", error);
        throw new Error("Failed to delete account");
    }
}
