import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { getApprovedComments } from "@/lib/data-service";
import userImage from "@/public/user.png";
import DeleteCommentButton from "./DeleteCommentButton";

async function Comments({ suitId, user }) {
    const comments = await getApprovedComments(suitId);
    const isAdmin = user?.role === "admin";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    if (comments.length === 0) {
        return (
            <div className="mt-12">
                <div className="inline-block mb-6">
                    <span className="subHeading">&bull; Comments</span>
                    <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
                </div>
                <p className="text-gray-500 text-center py-8 italic">
                    No comments yet. Be the first to write a review!
                </p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <div className="inline-block mb-6">
                <span className="subHeading">
                    &bull; Comments ({comments.length})
                </span>
                <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="relative group p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                        {isAdmin && (
                            <DeleteCommentButton commentId={comment.id} />
                        )}

                        <div className="flex items-start gap-4">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                    src={comment.users?.avatar || userImage}
                                    alt={comment.fullname}
                                    fill
                                    className="rounded-full object-top object-cover"
                                />
                            </div>

                            {/* محتوای کامنت */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            {comment.fullname}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(comment.created_at)}
                                        </p>
                                    </div>

                                    {/* امتیاز (ستاره‌ها) */}
                                    {comment.rating > 0 && (
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < comment.rating
                                                            ? "text-amber-500"
                                                            : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {comment.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comments;
