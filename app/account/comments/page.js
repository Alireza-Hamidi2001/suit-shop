// app/account/comments/page.js
import {
    getPendingComments,
    approveComment,
    deleteComment,
} from "@/lib/data-service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import CommentActions from "./CommentActions";

export const metadata = {
    title: "Manage Comments | Admin",
};

async function CommentsManagementPage() {
    const user = await getCurrentUser();

    if (user?.role !== "admin") {
        redirect("/account");
    }

    const pendingComments = await getPendingComments();

    return (
        <div>
            <div className="inline-block mb-8">
                <span className="subHeading">&bull; Pending Comments</span>
                <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
            </div>

            {pendingComments.length === 0 ? (
                <div className="text-center py-16 bg-amber-50 dark:bg-zinc-900 rounded-lg">
                    <p className="text-gray-500 italic">
                        No pending comments to review.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* تصویر محصول */}
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image
                                        src={
                                            comment.suits?.image ||
                                            "/placeholder.jpg"
                                        }
                                        alt={comment.suits?.name || "Product"}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                                {/* اطلاعات نظر */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <Link
                                                href={`/collection/${comment.suit_id}`}
                                                className="font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                                                target="_blank">
                                                {comment.suits?.name ||
                                                    `Product #${comment.suit_id}`}
                                            </Link>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                By: {comment.fullname} (
                                                {comment.email})
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(
                                                    comment.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <CommentActions
                                            commentId={comment.id}
                                        />
                                    </div>

                                    <p className="mt-3 text-gray-700 dark:text-gray-300 italic border-l-4 border-amber-300 pl-3">
                                        "{comment.comment}"
                                    </p>

                                    {comment.rating && (
                                        <div className="mt-2 flex items-center gap-1">
                                            <span className="text-sm text-gray-500">
                                                Rating:
                                            </span>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-sm ${
                                                            i < comment.rating
                                                                ? "text-amber-500"
                                                                : "text-gray-300"
                                                        }`}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentsManagementPage;
