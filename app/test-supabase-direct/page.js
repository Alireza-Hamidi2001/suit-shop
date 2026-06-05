// app/test-supabase-direct/page.js
import { supabase } from "@/lib/supabase";

export default async function TestSupabaseDirectPage() {
    // ✅ اصلاح: حذف "as name" از داخل select
    const { data, error } = await supabase
        .from("users")
        .select("id, fullname, email, password, role") // ✅ فقط fullname
        .eq("email", "alireza@gmail.com")
        .eq("password", "987654")
        .single();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
                Direct Supabase Query Test
            </h1>

            {error ? (
                <div className="bg-red-100 p-4 rounded text-red-700">
                    <p>
                        <strong>Error:</strong> {error.message}
                    </p>
                    <p className="text-sm mt-2">Status: {error?.status}</p>
                </div>
            ) : (
                <div className="bg-green-100 p-4 rounded">
                    <p className="font-bold text-green-700">✅ User found!</p>
                    <pre className="mt-2 text-sm">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
