import { supabase } from "@/lib/supabase";

export default async function TestSupabaseDirect() {
    // تست مستقیم بدون استفاده از تابع getSuit
    const { data, error } = await supabase
        .from("suits")
        .select("*")
        .eq("id", 1)
        .single();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Direct Supabase Test</h1>
            {error ? (
                <div className="bg-red-100 p-4 rounded text-red-700">
                    <p>Error: {error.message}</p>
                </div>
            ) : (
                <div className="bg-green-100 p-4 rounded">
                    <p className="font-bold">✅ Success!</p>
                    <pre className="mt-2 text-sm overflow-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
