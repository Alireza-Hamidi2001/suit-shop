// lib/auth.js
import { cookies } from "next/headers";
import { verifyToken, signToken } from "./jwt";
import { supabase } from "./supabase";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

// ========== NextAuth Configuration ==========
const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                // بررسی وجود کاربر در Supabase
                const { data: existingUser } = await supabase
                    .from("users")
                    .select("id")
                    .eq("email", user.email)
                    .single();

                if (!existingUser) {
                    // ذخیره کاربر جدید از Google
                    await supabase.from("users").insert([
                        {
                            fullname: user.name,
                            email: user.email,
                            avatar: user.image,
                            role: "user",
                            created_at: new Date().toISOString(),
                        },
                    ]);
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                // اضافه کردن id کاربر به session
                const { data: dbUser } = await supabase
                    .from("users")
                    .select("id")
                    .eq("email", session.user.email)
                    .single();

                session.user.id = dbUser?.id;
            }
            return session;
        },
    },
};

export const {
    auth,
    handlers: { GET, POST },
} = NextAuth(authConfig);

// ========== Custom Auth (سیستم خودت با Supabase) ==========

// ✅ دریافت کاربر با ایمیل و رمز (برای لاگین)
export async function getUserByCredentials(email, password) {
    try {
        console.log("🔍 Login attempt - email:", email);

        const { data, error } = await supabase
            .from("users")
            .select(
                "id, fullname, email, password, avatar, role, phone, description, address, building_number, postal_code, unit",
            )
            .eq("email", email)
            .eq("password", password)
            .single();

        console.log("📦 Data from Supabase:", data);
        console.log("📦 Error from Supabase:", error);

        if (error || !data) return null;

        // تبدیل fullname به name برای سازگاری با بقیه کد
        return {
            id: data.id,
            name: data.fullname,
            email: data.email,
            password: data.password,
            avatar: data.avatar,
            role: data.role,
            phone: data.phone,
            description: data.description,
            address: data.address,
            building_number: data.building_number,
            postal_code: data.postal_code,
            unit: data.unit,
        };
    } catch (error) {
        console.error("Error in getUserByCredentials:", error);
        return null;
    }
}

// همچنین getUserById را اصلاح کن:

export async function getUserById(id) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select(
                "id, fullname, email, avatar, role, phone, description, address, building_number, postal_code, unit",
            )
            .eq("id", id)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            name: data.fullname,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
            phone: data.phone,
            description: data.description,
            address: data.address,
            building_number: data.building_number,
            postal_code: data.postal_code,
            unit: data.unit,
        };
    } catch (error) {
        console.error("Error in getUserById:", error);
        return null;
    }
}

// ✅ دریافت کاربر فعلی (پشتیبانی از هر دو روش)
export async function getCurrentUser() {
    // 1. اول سشن NextAuth رو چک کن
    const session = await auth();
    if (session?.user) {
        // از Supabase اطلاعات کامل کاربر رو بگیر
        const { data: dbUser } = await supabase
            .from("users")
            .select(
                "id, fullname as name, email, avatar, role, phone, description, address, building_number, postal_code, unit",
            )
            .eq("email", session.user.email)
            .single();

        if (dbUser) {
            return dbUser;
        }

        // اگر در دیتابیس نبود، اطلاعات پایه رو برگردون
        return {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.image,
            role: "user",
            phone: "",
            description: "",
            address: "",
            building_number: "",
            postal_code: "",
            unit: "",
        };
    }

    // 2. بعد سشن خودت رو چک کن
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    return getUserById(decoded.id);
}

// ✅ ایجاد سشن (ذخیره توکن در کوکی)
export async function createSession(user) {
    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
    });

    return token;
}

// ✅ حذف سشن (خروج از حساب)
export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}
