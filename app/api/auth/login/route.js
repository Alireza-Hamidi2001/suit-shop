// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { getUserByCredentials, createSession } from "@/lib/auth";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 },
            );
        }

        // ✅ اضافه کردن await (چون getUserByCredentials الان async است)
        const user = await getUserByCredentials(email, password);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 },
            );
        }

        await createSession(user);

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
