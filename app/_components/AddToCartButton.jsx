// components/AddToCartButton.js
"use client";

import { useState } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ suitId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const handleAddToCart = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ suitId, quantity: 1 }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to add to cart");
            }

            setMessage({
                type: "success",
                text: "Added to cart successfully!",
            });

            // آپدیت کردن تعداد سبد خرید در نویگیشن (اگر نیاز باشد)
            router.refresh();

            // پاک کردن پیام بعد از 3 ثانیه
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            {message && (
                <div
                    className={`mb-3 p-2 rounded text-center text-sm ${
                        message.type === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                >
                    {message.text}
                </div>
            )}
            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="addButton justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <IoShirtOutline
                    className={`h-5 w-5 ${isLoading ? "animate-pulse" : ""}`}
                />
                {isLoading ? "Adding..." : "Add to Cart"}
            </button>
        </div>
    );
}
