// lib/mysql.js
import mysql from "mysql2/promise";

// بررسی وجود متغیرهای محیطی ضروری
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.warn(`⚠️ Environment variable ${envVar} is not set`);
    }
}

// تابع ساخت pool با تنظیمات بهینه
async function createPool() {
    const poolConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME, // باید suiteliershop باشه
        port: parseInt(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    };

    // برای محیط تولید (Vercel, PlanetScale) SSL را فعال کن
    if (process.env.NODE_ENV === "production") {
        poolConfig.ssl = {
            rejectUnauthorized: false,
        };
    }

    return mysql.createPool(poolConfig);
}

// Singleton pattern برای مدیریت pool
let globalPool = null;

export async function getPool() {
    if (process.env.NODE_ENV === "development" && globalPool) {
        return globalPool;
    }

    if (!globalPool) {
        if (!globalThis.mysqlPool) {
            globalThis.mysqlPool = await createPool();
        }
        globalPool = globalThis.mysqlPool;
    }

    return globalPool;
}

// بستن pool (برای تست یا graceful shutdown)
export async function closePool() {
    if (globalPool) {
        await globalPool.end();
        globalPool = null;
        globalThis.mysqlPool = null;
    }
}

// صادر کردن پیش‌فرض
let defaultPool = null;

export default async function pool() {
    if (!defaultPool) {
        defaultPool = await getPool();
    }
    return defaultPool;
}

// تابع کمکی برای اجرای کوئری
export async function query(sql, params) {
    const pool = await getPool();
    const [rows] = await pool.query(sql, params);
    return rows;
}
