import { supabase } from "./supabase";


// lib/data-service.js
export async function getOrdersByUser(userId) {
    try {
        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
                id,
                order_date,
                total_amount,
                status,
                order_items (
                    id,
                    quantity,
                    price,
                    suits (
                        id,
                        name,
                        image,
                        price
                    )
                )
            `)
            .eq("user_id", userId)
            .order("order_date", { ascending: false });

        if (error) throw error;
        return orders || [];
    } catch (error) {
        console.error("Error in getOrdersByUser:", error);
        return [];
    }
}
// ========== GET: COMMENTS ==========
// دریافت تعداد نظرات تایید نشده (برای نمایش در منوی ادمین)
export async function getPendingCommentsCount() {
    try {
        const { count, error } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("is_approved", false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error("Error in getPendingCommentsCount:", error);
        return 0;
    }
}
// دریافت نظرات تایید شده برای یک محصول
export async function getApprovedComments(suitId) {
    try {
        const { data, error } = await supabase
            .from("comments")
            .select(
                `
                id,
                comment,
                rating,
                created_at,
                fullname,
                email,
                user_id,
                users:user_id (fullname, avatar)
            `,
            )
            .eq("suit_id", suitId)
            .eq("is_approved", true)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error in getApprovedComments:", error);
        return [];
    }
}

// دریافت نظرات تایید نشده (برای ادمین)
export async function getPendingComments() {
    try {
        const { data, error } = await supabase
            .from("comments")
            .select(
                `
                id,
                comment,
                rating,
                created_at,
                fullname,
                email,
                suit_id,
                suits:suits (name, image)
            `,
            )
            .eq("is_approved", false)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error in getPendingComments:", error);
        return [];
    }
}

// ایجاد نظر جدید
export async function createComment(commentData) {
    try {
        const { data, error } = await supabase
            .from("comments")
            .insert([
                {
                    suit_id: commentData.suitId,
                    user_id: commentData.userId,
                    fullname: commentData.fullname,
                    email: commentData.email,
                    comment: commentData.comment,
                    rating: commentData.rating || null,
                    is_approved: false,
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error in createComment:", error);
        throw new Error("Failed to create comment");
    }
}

// تایید نظر
export async function approveComment(commentId) {
    try {
        const { error } = await supabase
            .from("comments")
            .update({ is_approved: true })
            .eq("id", commentId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error in approveComment:", error);
        throw new Error("Failed to approve comment");
    }
}

// حذف نظر
export async function deleteComment(commentId) {
    try {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error in deleteComment:", error);
        throw new Error("Failed to delete comment");
    }
}

// ========== GET: SUITS (محصولات) ==========

// دریافت همه کت شلوارها (بدون صفحه‌بندی)
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

// دریافت کت شلوارها با صفحه‌بندی (برای صفحه collection)
export async function getSuitsPaginated(page = 1, limit = 6, filter = "all") {
    try {
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        let query = supabase.from("suits").select("*", { count: "exact" });

        // اعمال فیلتر - همه از روی category
        if (filter !== "all") {
            query = query.eq("category", filter);
        }

        const { data, error, count } = await query
            .order("id")
            .range(start, end);

        if (error) throw error;

        return {
            suits: (data || []).map((suit) => ({
                ...suit,
                price: Number(suit.price),
                discount: Number(suit.discount),
                image: suit.image || "/suits/suit-placeholder.jpg",
            })),
            total: count || 0,
            currentPage: page,
            totalPages: Math.ceil((count || 0) / limit),
            limit,
        };
    } catch (error) {
        console.error("Error in getSuitsPaginated:", error);
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

        if (error) {
            if (error.code === "PGRST116") {
                console.log(`Suit with id ${id} not found.`);
                return null;
            }
            console.error("Supabase error in getSuit:", error);
            return null;
        }

        if (!data) return null;

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

// دریافت قیمت یک کت شلوار (با تخفیف محاسبه شده)
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
        const finalPrice = price - (price * discount) / 100;

        return {
            originalPrice: price,
            discount,
            finalPrice,
        };
    } catch (error) {
        console.error("Error in getSuitPrice:", error);
        return null;
    }
}

// دریافت کت شلوارهای با تخفیف ویژه (برای صفحه اصلی)
export async function getDiscountedSuits() {
    try {
        const { data, error } = await supabase
            .from("suits")
            .select("id,name,price,discount,description,image,fabric,category")
            .gt("discount", 0)
            .order("discount", { ascending: false })
            .limit(6);

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
            .select("id,fullname,email,phone,address,role,created_at,avatar")
            .eq("id", id)
            .single();

        if (error) return null;
        return data;
    } catch (error) {
        console.error("Error in getUserById:", error);
        return null;
    }
}

// // ========== GET: ORDERS (سفارشات) ==========

// export async function getOrdersByUser(userId) {
//     try {
//         const { data: orders, error: ordersError } = await supabase
//             .from("orders")
//             .select("*")
//             .eq("user_id", userId)
//             .order("order_date", { ascending: false });

//         if (ordersError) throw ordersError;

//         if (!orders || orders.length === 0) return [];

//         const ordersWithCount = await Promise.all(
//             orders.map(async (order) => {
//                 const { count, error: countError } = await supabase
//                     .from("order_items")
//                     .select("*", { count: "exact", head: true })
//                     .eq("order_id", order.id);

//                 if (countError) throw countError;

//                 return {
//                     ...order,
//                     items_count: count || 0,
//                 };
//             }),
//         );

//         return ordersWithCount;
//     } catch (error) {
//         console.error("Error in getOrdersByUser:", error);
//         throw new Error("Orders could not be loaded");
//     }
// }

export async function getOrderDetails(orderId) {
    try {
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (orderError || !order) return null;

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
        return data?.setting_value || null;
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
