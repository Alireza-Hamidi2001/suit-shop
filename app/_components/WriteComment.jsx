"use client";

import { useState } from "react";
import { FaPaperPlane, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function WriteComment({ suitId, user }) {
    const router = useRouter();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to write a comment");
            return;
        }

        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading("Submitting your comment...");

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    suitId,
                    userId: user.id,
                    fullname: user.name,
                    email: user.email,
                    comment: comment.trim(),
                    rating: rating || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit comment");
            }

            toast.success(
                "Comment submitted! It will appear after admin approval.",
                {
                    id: loadingToast,
                    duration: 4000,
                },
            );

            setComment("");
            setRating(0);
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
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mb-6 p-4 bg-amber-50 dark:bg-zinc-900 rounded-lg"
        >
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                        >
                            <FaStar
                                className={`w-6 h-6 transition-colors ${
                                    (hoverRating || rating) >= star
                                        ? "text-amber-500"
                                        : "text-gray-300 dark:text-gray-600"
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <span className="text-sm text-gray-500">
                    {rating > 0
                        ? `${rating} star${rating > 1 ? "s" : ""}`
                        : "Rate this product"}
                </span>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="input flex-1 bg-white dark:bg-zinc-600"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !comment.trim()}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-amber-600 disabled:cursor-not-allowed"
                >
                    <FaPaperPlane className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
}

export default WriteComment;