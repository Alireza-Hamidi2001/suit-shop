"use client";

import { useState } from "react";
import { IoWarning } from "react-icons/io5";
import { deleteSuitAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function DeleteSuitModal({
    deleteModalShow,
    setDeleteModalShow,
    suitId,
    onDelete,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Deleting product...");

        try {
            const formData = new FormData();
            formData.append("id", suitId);

            const result = await deleteSuitAction(formData);

            if (result.success) {
                toast.success("Product deleted successfully!", {
                    id: loadingToast,
                    duration: 3000,
                });
                setDeleteModalShow(false);
                router.refresh();
                onDelete?.(); // رفرش لیست در صورت نیاز
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete product", {
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
                deleteModalShow
                    ? "flex fixed inset-0 justify-center items-center z-50 bg-black/50 dark:bg-white/50 backdrop-blur-sm"
                    : "hidden"
            }`}
        >
            <div className="relative flex flex-col justify-center gap-4 rounded-sm bg-white dark:bg-black text-black dark:text-white px-10 py-6 shadow-xl">
                <h1 className="paragraph flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <IoWarning className="h-8 w-8 error" />
                        Delete this product
                    </div>
                    <button
                        onClick={() => setDeleteModalShow(false)}
                        className="times"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </h1>

                <p className="paragraph">
                    Are you sure you want to delete this product? <br />
                    You&apos;ll lose all of its details permanently.
                </p>

                <div className="border-t pt-4 border-zinc-300 dark:border-zinc-700 flex gap-2 justify-end">
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                    <button
                        className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setDeleteModalShow(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSuitModal;
