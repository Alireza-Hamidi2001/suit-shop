// lib/mysql.js
import mysql from "mysql2/promise";

function parseDatabaseUrl(url) {
    const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):?(\d+)?\/([^?]+)/;
    const matches = url.match(regex);

    if (matches) {
        return {
            user: matches[1],
            password: matches[2],
            host: matches[3],
            port: parseInt(matches[4]) || 3306,
            database: matches[5],
        };
    }
    return null;
}

async function createPool() {
    let poolConfig = {};

    if (process.env.DATABASE_URL) {
        const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
        if (parsed) {
            poolConfig = {
                host: parsed.host,
                user: parsed.user,
                password: parsed.password,
                database: parsed.database,
                port: parsed.port,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            };
        } else {
            poolConfig = {
                uri: process.env.DATABASE_URL,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            };
        }
    }
    else {
        poolConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT) || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        };
    }

    if (!process.env.DATABASE_URL) {
        const requiredEnvVars = [
            "DB_HOST",
            "DB_USER",
            "DB_PASSWORD",
            "DB_NAME",
        ];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                console.warn(`⚠️ Environment variable ${envVar} is not set`);
            }
        }
    }

    if (process.env.NODE_ENV === "production") {
        poolConfig.ssl = {
            rejectUnauthorized: false,
        };
    }

    console.log("✅ Creating MySQL pool with config:", {
        host: poolConfig.host || "using URI",
        database: poolConfig.database || "using URI",
        ssl: !!poolConfig.ssl,
    });

    return mysql.createPool(poolConfig);
}

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

export async function closePool() {
    if (globalPool) {
        await globalPool.end();
        globalPool = null;
        globalThis.mysqlPool = null;
    }
}

let defaultPool = null;

export default async function pool() {
    if (!defaultPool) {
        defaultPool = await getPool();
    }
    return defaultPool;
}

export async function query(sql, params) {
    const pool = await getPool();
    const [rows] = await pool.query(sql, params);
    return rows;
}
