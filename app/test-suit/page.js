import { getSuit } from "@/lib/data-service";

export default async function TestSuitPage() {
    // تست برای ID 1
    const suit1 = await getSuit(1);
    const suit8 = await getSuit(8);
    const suit13 = await getSuit(13);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Test getSuit Function</h1>

            <div className="space-y-4">
                <div className="border p-4 rounded bg-green-50">
                    <h2 className="font-bold">Suit ID 1:</h2>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(suit1, null, 2)}
                    </pre>
                </div>

                <div className="border p-4 rounded bg-blue-50">
                    <h2 className="font-bold">Suit ID 8:</h2>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(suit8, null, 2)}
                    </pre>
                </div>

                <div className="border p-4 rounded bg-red-50">
                    <h2 className="font-bold">Suit ID 13 (should be null):</h2>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(suit13, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
