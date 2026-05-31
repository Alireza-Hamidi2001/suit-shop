// lib/auth.js
import { cookies } from "next/headers";
import { verifyToken, signToken } from "./jwt";
import { query } from "./mysql";
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
                // بررسی وجود کاربر در دیتابیس خودت
                const existingUser = await query(
                    "SELECT id FROM users WHERE email = ?",
                    [user.email],
                );

                if (existingUser.length === 0) {
                    // ذخیره کاربر جدید از Google
                    await query(
                        `INSERT INTO users (fullname, email, avatar, role, created_at) 
                        VALUES (?, ?, ?, 'user', NOW())`,
                        [user.name, user.email, user.image],
                    );
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                // اضافه کردن id کاربر به session
                const dbUser = await query(
                    "SELECT id FROM users WHERE email = ?",
                    [session.user.email],
                );
                session.user.id = dbUser[0]?.id;
            }
            return session;
        },
    },
};

export const {
    auth,
    handlers: { GET, POST },
} = NextAuth(authConfig);

// ========== Custom Auth (سیستم خودت) ==========

export async function getUserByCredentials(email, password) {
    try {
        const rows = await query(
            "SELECT id, fullname as name, email, password, avatar, role, phone, description, address, building_number, postal_code, unit FROM users WHERE email = ? AND password = ?",
            [email, password],
        );
        return rows[0] || null;
    } catch (error) {
        console.error("Error in getUserByCredentials:", error);
        return null;
    }
}

export async function getUserById(id) {
    try {
        const rows = await query(
            "SELECT id, fullname as name, email, avatar, role, phone, description, address, building_number, postal_code, unit FROM users WHERE id = ?",
            [id],
        );
        return rows[0] || null;
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
        // از دیتابیس اطلاعات کامل کاربر رو بگیر
        const dbUser = await query(
            "SELECT id, fullname as name, email, avatar, role, phone, description, address, building_number, postal_code, unit FROM users WHERE email = ?",
            [session.user.email],
        );

        if (dbUser && dbUser.length > 0) {
            return dbUser[0];
        }

        // اگر در دیتابیس نبود (خطا)، اطلاعات پایه رو برگردون
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

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}
