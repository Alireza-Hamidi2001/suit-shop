// app/test-login/page.js
"use client";

import { useState } from "react";

export default function TestLoginPage() {
    const [email, setEmail] = useState("alireza@gmail.com");
    const [password, setPassword] = useState("987654");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTest = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            setResult({ status: res.status, data });
        } catch (err) {
            setResult({ error: err.message });
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Test Login API</h1>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    onClick={handleTest}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    {loading ? "Testing..." : "Test Login"}
                </button>

                {result && (
                    <pre className="bg-gray-100 p-4 rounded mt-4 overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
