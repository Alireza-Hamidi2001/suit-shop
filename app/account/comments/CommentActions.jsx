"use client";

import { useRouter } from "next/navigation";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";

function CommentActions({ commentId }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Approving comment...");

        try {
            const res = await fetch("/api/comments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: commentId, is_approved: true }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to approve");
            }

            toast.success("Comment approved successfully!", {
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

    const handleDelete = async () => {
        if (
            !confirm(
                "Are you sure you want to permanently delete this comment?",
            )
        ) {
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading("Deleting comment...");

        try {
            const res = await fetch(`/api/comments?id=${commentId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete");
            }

            toast.success("Comment deleted successfully!", {
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
        <div className="flex gap-2">
            <button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                title="Approve comment"
            >
                <FaCheck className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Approve</span>
            </button>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                title="Delete comment"
            >
                <FaTrashAlt className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Delete</span>
            </button>
        </div>
    );
}

export default CommentActions;
