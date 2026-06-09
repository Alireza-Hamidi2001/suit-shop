// app/account/orders/ModalDeleteOrder.jsx
"use client";

import { useRouter } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import { useState } from "react";
import toast from "react-hot-toast";

function ModalDeleteOrder({ showModal, setShowModal, orderId, onDelete }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!orderId) return;

        setIsLoading(true);
        const loadingToast = toast.loading("Cancelling order...");

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to cancel order");
            }

            toast.success("Order cancelled successfully!", {
                id: loadingToast,
                duration: 3000,
            });

            setShowModal(false);
            router.refresh();
            if (onDelete) onDelete(orderId);
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
        <div
            className={`${
                showModal
                    ? "flex fixed inset-0 justify-center items-center z-50 bg-black/50 dark:bg-white/50 backdrop-blur-sm"
                    : "hidden"
            }`}
        >
            <div className="relative flex flex-col justify-center gap-4 rounded-sm bg-white dark:bg-black text-black dark:text-white px-10 py-6 shadow-xl">
                <h1 className="paragraph flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <IoWarning className="h-8 w-8 error" />
                        Cancel Order
                    </div>
                    <button
                        onClick={() => setShowModal(false)}
                        className="times"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </h1>

                <p className="paragraph">
                    Are you sure you want to cancel this order? <br />
                    This action cannot be undone.
                </p>

                <div className="border-t pt-4 border-zinc-300 dark:border-zinc-700 flex gap-2 justify-end">
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "Cancelling..." : "Yes, Cancel Order"}
                    </button>
                    <button
                        className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setShowModal(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalDeleteOrder;
