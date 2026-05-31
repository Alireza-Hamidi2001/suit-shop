// lib/jwt.js
import { createHmac, timingSafeEqual } from "crypto";

const SECRET_KEY =
    process.env.JWT_SECRET || "my-super-secret-key-change-this-in-production";

// تبدیل base64url به base64 استاندارد
function base64urlToBase64(base64url) {
    return base64url.replace(/-/g, "+").replace(/_/g, "/");
}

// تبدیل base64 استاندارد به base64url
function base64ToBase64url(base64) {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ایجاد توکن JWT (ساده و بدون پکیج)
export function signToken(payload) {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payloadWithExp = {
        ...payload,
        iat: now,
        exp: now + 7 * 24 * 60 * 60, // 7 روز
    };

    // encode header و payload
    const encodedHeader = base64ToBase64url(
        Buffer.from(JSON.stringify(header)).toString("base64"),
    );
    const encodedPayload = base64ToBase64url(
        Buffer.from(JSON.stringify(payloadWithExp)).toString("base64"),
    );

    // ساخت signature
    const signature = createHmac("sha256", SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64");
    const encodedSignature = base64ToBase64url(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

//验证 توکن
export function verifyToken(token) {
    try {
        const [encodedHeader, encodedPayload, encodedSignature] =
            token.split(".");

        // بازسازی signature و مقایسه
        const expectedSignature = createHmac("sha256", SECRET_KEY)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest("base64");
        const expectedEncodedSignature = base64ToBase64url(expectedSignature);

        // مقایسه امن (timing-safe)
        const signatureBuffer = Buffer.from(encodedSignature, "utf8");
        const expectedBuffer = Buffer.from(expectedEncodedSignature, "utf8");

        if (signatureBuffer.length !== expectedBuffer.length) {
            return null;
        }

        if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
            return null;
        }

        // دیکد payload
        const payloadJson = Buffer.from(
            base64urlToBase64(encodedPayload),
            "base64",
        ).toString("utf8");
        const payload = JSON.parse(payloadJson);

        // بررسی انقضا
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return null;
        }

        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

// دیکد توکن (بدون验证)
export function decodeToken(token) {
    try {
        const [, encodedPayload] = token.split(".");
        const payloadJson = Buffer.from(
            base64urlToBase64(encodedPayload),
            "base64",
        ).toString("utf8");
        return JSON.parse(payloadJson);
    } catch {
        return null;
    }
}
