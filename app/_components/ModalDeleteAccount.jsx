// app/_components/ModalDeleteAccount.jsx
import { deleteAccountAction } from "@/lib/actions";
import { useState } from "react";
import { IoWarning } from "react-icons/io5";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function ModalDeleteAccount({
    showDeleteModalWindow,
    setShowDeleteModalWindow,
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        setError("");

        try {
            // اجرای Server Action برای حذف حساب
            await deleteAccountAction();

            // بستن مودال (اختیاری، چون ریدایرکت می‌شود)
            setShowDeleteModalWindow(false);

            toast.success(
                "Account deleted successfully . Redirecting to home page...",
                {
                    id: loadingToast,
                    duration: 4000,
                },
            );

            // رفرش صفحه
            router.refresh();
        } catch (error) {
            console.error("Delete account error:", error);
            setError(error.message || "Failed to delete account");
            toast.error("Deleting account failed", error.message, {
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
                showDeleteModalWindow
                    ? "flex fixed inset-0 justify-center items-center z-50 bg-black/50 dark:bg-white/50 backdrop-blur-sm"
                    : "hidden"
            }`}
        >
            <div className="relative flex flex-col justify-center gap-4 rounded-sm bg-white dark:bg-black text-black dark:text-white px-10 py-6 shadow-xl">
                <h1 className="paragraph flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <IoWarning className="h-8 w-8 error" />
                        Delete Account Confirmation
                    </div>
                    <button
                        onClick={() => setShowDeleteModalWindow(false)}
                        className="times"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </h1>

                <p className="paragraph">
                    Are you sure you want to delete your account? <br />
                    You&apos;ll need to sign up again & you will lose all of
                    your information, including order history.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-2 text-sm">
                        {error}
                    </div>
                )}

                <div className="border-t pt-4 border-zinc-300 dark:border-zinc-700 flex gap-2 justify-end">
                    <button
                        className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete Account"}
                    </button>
                    <button
                        className="px-4 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setShowDeleteModalWindow(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalDeleteAccount;
