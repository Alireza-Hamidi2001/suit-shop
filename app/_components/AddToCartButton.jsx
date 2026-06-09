// components/AddToCartButton.jsx
"use client";

import { useState } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddToCartButton({ suitId, price }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Placing order...");

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ suitId, quantity: 1, price }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to place order");
            }

            toast.success("Order placed successfully!", {
                id: loadingToast,
                duration: 3000,
            });

            router.refresh();
        } catch (error) {
            toast.error(error.message, {
                id: loadingToast,
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="addButton w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <IoShirtOutline
                className={`h-5 w-5 ${isLoading ? "animate-pulse" : ""}`}
            />
            {isLoading ? "Placing Order..." : "Order Now"}
        </button>
    );
}
