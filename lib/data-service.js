import { notFound } from "next/navigation";
import pool from "./mysql";

// lib/data-service.js

// ========== توابع کمکی ==========
async function query(sql, params = []) {
    const connection = await pool();
    const [rows] = await connection.query(sql, params);
    return rows;
}

// ========== GET: SUITS (محصولات) ==========

// دریافت همه کت شلوارها
export async function getSuits() {
    try {
        // ✅ اضافه کردن category به SELECT
        let rows = await query(
            "SELECT id, name, price, discount, description, image, fabric, category FROM suits ORDER BY id",
        );
        rows = (rows || []).map((suit) => ({
            ...suit,
            price: Number(suit.price),
            discount: Number(suit.discount),
            image: suit.image || "/suits/suit-placeholder.jpg",
        }));
        return rows;
    } catch (error) {
        console.error("Error in getSuits:", error);
        throw new Error("Suits could not be loaded");
    }
}

// دریافت یک کت شلوار با آیدی
export async function getSuit(id) {
    try {
        console.log("getSuit called with id:", id);
        // ✅ استفاده از SELECT * یا مشخص کردن فیلدها
        const rows = await query(
            "SELECT id, name, price, discount, description, image, fabric, category FROM suits WHERE id = ?",
            [id],
        );
        console.log("getSuit rows:", rows);

        if (!rows || rows.length === 0) {
            console.log("No suit found with id:", id);
            return null;
        }

        const suit = rows[0];
        return {
            ...suit,
            price: Number(suit.price),
            discount: Number(suit.discount),
            image: suit.image || "/suits/suit-placeholder.jpg",
        };
    } catch (error) {
        console.error("Error in getSuit:", error);
        return null;
    }
}

// دریافت قیمت یک کت شلوار (با تخفیف محاسبه شده)
export async function getSuitPrice(id) {
    try {
        const rows = await query(
            "SELECT price, discount FROM suits WHERE id = ?",
            [id],
        );
        if (!rows[0]) return null;

        const price = Number(rows[0].price);
        const discount = Number(rows[0].discount);
        const finalPrice = price - (price * discount) / 100;

        return {
            originalPrice: price,
            discount: discount,
            finalPrice: finalPrice,
        };
    } catch (error) {
        console.error("Error in getSuitPrice:", error);
        return null;
    }
}

// دریافت کت شلوارهای با تخفیف ویژه
export async function getDiscountedSuits() {
    try {
        // ✅ اضافه کردن category به SELECT
        let rows = await query(
            "SELECT id, name, price, discount, description, image, fabric, category FROM suits WHERE discount > 0 ORDER BY discount DESC",
        );
        rows = (rows || []).map((suit) => ({
            ...suit,
            price: Number(suit.price),
            discount: Number(suit.discount),
            image: suit.image || "/suits/suit-placeholder.jpg",
        }));
        return rows;
    } catch (error) {
        console.error("Error in getDiscountedSuits:", error);
        throw new Error("Discounted suits could not be loaded");
    }
}

// ========== GET: USERS (کاربران) ==========

// دریافت کاربر با ایمیل
export async function getUser(email) {
    try {
        const rows = await query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        return rows[0] || null;
    } catch (error) {
        console.error("Error in getUser:", error);
        return null;
    }
}

// دریافت کاربر با آیدی
export async function getUserById(id) {
    try {
        const rows = await query(
            "SELECT id, fullname, email, phone, address, role, created_at FROM users WHERE id = ?",
            [id],
        );
        return rows[0] || null;
    } catch (error) {
        console.error("Error in getUserById:", error);
        return null;
    }
}

// ========== GET: ORDERS (سفارشات) ==========

// دریافت سفارشات یک کاربر
export async function getOrdersByUser(userId) {
    try {
        const rows = await query(
            `SELECT o.*, 
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC`,
            [userId],
        );
        return rows;
    } catch (error) {
        console.error("Error in getOrdersByUser:", error);
        throw new Error("Orders could not be loaded");
    }
}

// دریافت یک سفارش با جزئیات کامل (همراه با محصولات)
export async function getOrderDetails(orderId) {
    try {
        // اطلاعات اصلی سفارش
        const orderRows = await query("SELECT * FROM orders WHERE id = ?", [
            orderId,
        ]);
        if (!orderRows[0]) return null;

        // محصولات داخل سفارش
        const itemsRows = await query(
            `SELECT oi.*, s.name, s.image, s.fabric
            FROM order_items oi
            JOIN suits s ON oi.suit_id = s.id
            WHERE oi.order_id = ?`,
            [orderId],
        );

        return {
            ...orderRows[0],
            items: itemsRows,
        };
    } catch (error) {
        console.error("Error in getOrderDetails:", error);
        throw new Error("Order details could not be loaded");
    }
}

// ========== GET: SETTINGS (تنظیمات) ==========

// دریافت همه تنظیمات
export async function getSettings() {
    try {
        const rows = await query(
            "SELECT setting_key, setting_value FROM settings",
        );

        // تبدیل به آبجکت برای استفاده راحت‌تر
        const settings = {};
        rows.forEach((row) => {
            settings[row.setting_key] = row.setting_value;
        });

        return settings;
    } catch (error) {
        console.error("Error in getSettings:", error);
        throw new Error("Settings could not be loaded");
    }
}

// دریافت یک تنظیم خاص
export async function getSetting(key) {
    try {
        const rows = await query(
            "SELECT setting_value FROM settings WHERE setting_key = ?",
            [key],
        );
        return rows[0]?.setting_value || null;
    } catch (error) {
        console.error("Error in getSetting:", error);
        return null;
    }
}

// ========== CREATE (ایجاد رکورد جدید) ==========

// ایجاد کاربر جدید
export async function createUser(userData) {
    try {
        const connection = await pool();
        const [result] = await connection.query("INSERT INTO users SET ?", [
            userData,
        ]);
        return { id: result.insertId, ...userData };
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error("User could not be created");
    }
}

// ایجاد سفارش جدید
export async function createOrder(orderData) {
    try {
        const connection = await pool();
        const [result] = await connection.query("INSERT INTO orders SET ?", [
            orderData,
        ]);
        return { id: result.insertId, ...orderData };
    } catch (error) {
        console.error("Error in createOrder:", error);
        throw new Error("Order could not be created");
    }
}

// ایجاد آیتم سفارش (محصول داخل سفارش)
export async function createOrderItem(orderItemData) {
    try {
        const connection = await pool();
        const [result] = await connection.query(
            "INSERT INTO order_items SET ?",
            [orderItemData],
        );
        return { id: result.insertId, ...orderItemData };
    } catch (error) {
        console.error("Error in createOrderItem:", error);
        throw new Error("Order item could not be created");
    }
}

// ========== UPDATE (به‌روزرسانی) ==========

// به‌روزرسانی کاربر
export async function updateUser(id, updatedFields) {
    try {
        const connection = await pool();
        await connection.query("UPDATE users SET ? WHERE id = ?", [
            updatedFields,
            id,
        ]);
        const rows = await query("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];
    } catch (error) {
        console.error("Error in updateUser:", error);
        throw new Error("User could not be updated");
    }
}

// به‌روزرسانی وضعیت سفارش
export async function updateOrderStatus(id, status) {
    try {
        const connection = await pool();
        await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
            status,
            id,
        ]);
        const rows = await query("SELECT * FROM orders WHERE id = ?", [id]);
        return rows[0];
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        throw new Error("Order status could not be updated");
    }
}

// ========== DELETE (حذف) ==========

// حذف سفارش (و آیتم‌هایش به صورت اتوماتیک با CASCADE حذف میشن)
export async function deleteOrder(id) {
    try {
        const connection = await pool();
        const [result] = await connection.query(
            "DELETE FROM orders WHERE id = ?",
            [id],
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        throw new Error("Order could not be deleted");
    }
}
