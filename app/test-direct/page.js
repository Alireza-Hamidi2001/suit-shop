import mysql from "mysql2/promise";

export default async function TestDirectPage() {
    let result = null;
    let error = null;

    try {
        // اتصال مستقیم به دیتابیس (بدون استفاده از pool)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT) || 3306,
        });

        const [rows] = await connection.execute("SELECT * FROM suits LIMIT 3");
        result = rows;
        await connection.end();
    } catch (err) {
        error = err.message;
        console.error("Direct DB error:", err);
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Direct Database Test</h1>

            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <h2 className="font-semibold">Environment Variables:</h2>
                <pre className="text-sm">
                    DB_HOST: {process.env.DB_HOST || "NOT SET"}
                    {"\n"}
                    DB_USER: {process.env.DB_USER || "NOT SET"}
                    {"\n"}
                    DB_NAME: {process.env.DB_NAME || "NOT SET"}
                    {"\n"}
                    DB_PORT: {process.env.DB_PORT || "3306 (default)"}
                </pre>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 p-4 rounded mb-4">
                    <h2 className="font-bold text-red-700">Error:</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {result && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 p-4 rounded">
                    <h2 className="font-bold text-green-700">
                        Success! Found {result.length} suits:
                    </h2>
                    <pre className="mt-2 text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
