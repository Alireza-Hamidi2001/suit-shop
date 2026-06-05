// app/test-supabase/page.js
import { supabase } from "@/lib/supabase";

export default async function TestSupabasePage() {
    // تست اتصال و گرفتن کاربر
    const { data: users, error } = await supabase
        .from("users")
        .select("email, password, fullname, role");

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Supabase Users Test</h1>

            {error ? (
                <div className="bg-red-100 p-4 rounded text-red-700">
                    Error: {error.message}
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-green-600">
                        ✅ Connected! Found {users?.length || 0} users.
                    </p>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(users, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
