import { supabase } from "./supabase";

// ========== GET: SUITS (محصولات) ==========

export async function getSuits() {
    try {
        const { data, error } = await supabase
            .from("suits")
            .select("id,name,price,discount,description,image,fabric,category")
            .order("id");

        if (error) throw error;

        return (data || []).map((suit) => ({
            ...suit,
            price: Number(suit.price),
            discount: Number(suit.discount),
            image: suit.image || "/suits/suit-placeholder.jpg",
        }));
    } catch (error) {
        console.error("Error in getSuits:", error);
        throw new Error("Suits could not be loaded");
    }
}

export async function getSuit(id) {
    try {
        const { data, error } = await supabase
            .from("suits")
            .select("id,name,price,discount,description,image,fabric,category")
            .eq("id", id)
            .single();

        if (error) return null;

        return {
            ...data,
            price: Number(data.price),
            discount: Number(data.discount),
            image: data.image || "/suits/suit-placeholder.jpg",
        };
    } catch (error) {
        console.error("Error in getSuit:", error);
        return null;
    }
}

export async function getSuitPrice(id) {
    try {
        const { data, error } = await supabase
            .from("suits")
            .select("price,discount")
            .eq("id", id)
            .single();

        if (error || !data) return null;

        const price = Number(data.price);
        const discount = Number(data.discount);

        return {
            originalPrice: price,
            discount,
            finalPrice: price - (price * discount) / 100,
        };
    } catch (error) {
        console.error("Error in getSuitPrice:", error);
        return null;
    }
}

export async function getDiscountedSuits() {
    try {
        const { data, error } = await supabase
            .from("suits")
            .select("id,name,price,discount,description,image,fabric,category")
            .gt("discount", 0)
            .order("discount", { ascending: false });

        if (error) throw error;

        return (data || []).map((suit) => ({
            ...suit,
            price: Number(suit.price),
            discount: Number(suit.discount),
            image: suit.image || "/suits/suit-placeholder.jpg",
        }));
    } catch (error) {
        console.error("Error in getDiscountedSuits:", error);
        throw new Error("Discounted suits could not be loaded");
    }
}

// ========== GET: USERS (کاربران) ==========

export async function getUser(email) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error) return null;

        return data;
    } catch (error) {
        console.error("Error in getUser:", error);
        return null;
    }
}

export async function getUserById(id) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id,fullname,email,phone,address,role,created_at")
            .eq("id", id)
            .single();

        if (error) return null;

        return data;
    } catch (error) {
        console.error("Error in getUserById:", error);
        return null;
    }
}

// ========== GET: ORDERS (سفارشات) ==========

export async function getOrdersByUser(userId) {
    try {
        // ابتدا سفارشات کاربر را دریافت می‌کنیم
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", userId)
            .order("order_date", { ascending: false });

        if (ordersError) throw ordersError;

        if (!orders || orders.length === 0) return [];

        // برای هر سفارش، تعداد آیتم‌ها را دریافت می‌کنیم
        const ordersWithCount = await Promise.all(
            orders.map(async (order) => {
                const { count, error: countError } = await supabase
                    .from("order_items")
                    .select("*", { count: "exact", head: true })
                    .eq("order_id", order.id);

                if (countError) throw countError;

                return {
                    ...order,
                    items_count: count || 0,
                };
            }),
        );

        return ordersWithCount;
    } catch (error) {
        console.error("Error in getOrdersByUser:", error);
        throw new Error("Orders could not be loaded");
    }
}

export async function getOrderDetails(orderId) {
    try {
        // دریافت اطلاعات اصلی سفارش
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (orderError || !order) return null;

        // دریافت آیتم‌های سفارش با جزئیات محصولات
        const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select(
                `
                *,
                suits: suit_id (
                    name,
                    image,
                    fabric
                )
            `,
            )
            .eq("order_id", orderId);

        if (itemsError) throw itemsError;

        return {
            ...order,
            items: items || [],
        };
    } catch (error) {
        console.error("Error in getOrderDetails:", error);
        throw new Error("Order details could not be loaded");
    }
}

// ========== GET: SETTINGS (تنظیمات) ==========

export async function getSettings() {
    try {
        const { data, error } = await supabase
            .from("settings")
            .select("setting_key,setting_value");

        if (error) throw error;

        const settings = {};

        data.forEach((row) => {
            settings[row.setting_key] = row.setting_value;
        });

        return settings;
    } catch (error) {
        console.error("Error in getSettings:", error);
        throw new Error("Settings could not be loaded");
    }
}

export async function getSetting(key) {
    try {
        const { data, error } = await supabase
            .from("settings")
            .select("setting_value")
            .eq("setting_key", key)
            .single();

        if (error) return null;

        return data.setting_value;
    } catch (error) {
        console.error("Error in getSetting:", error);
        return null;
    }
}

// ========== CREATE (ایجاد رکورد جدید) ==========

export async function createUser(userData) {
    try {
        const { data, error } = await supabase
            .from("users")
            .insert([userData])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error("User could not be created");
    }
}

export async function createOrder(orderData) {
    try {
        const { data, error } = await supabase
            .from("orders")
            .insert([orderData])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error in createOrder:", error);
        throw new Error("Order could not be created");
    }
}

export async function createOrderItem(orderItemData) {
    try {
        const { data, error } = await supabase
            .from("order_items")
            .insert([orderItemData])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error in createOrderItem:", error);
        throw new Error("Order item could not be created");
    }
}

// ========== UPDATE (به‌روزرسانی) ==========

export async function updateUser(id, updatedFields) {
    try {
        const { data, error } = await supabase
            .from("users")
            .update(updatedFields)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error in updateUser:", error);
        throw new Error("User could not be updated");
    }
}

export async function updateOrderStatus(id, status) {
    try {
        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        throw new Error("Order status could not be updated");
    }
}

// ========== DELETE (حذف) ==========

export async function deleteOrder(id) {
    try {
        const { error } = await supabase.from("orders").delete().eq("id", id);

        if (error) throw error;

        return true;
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        throw new Error("Order could not be deleted");
    }
}
