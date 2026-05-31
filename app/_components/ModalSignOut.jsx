// app/_components/ModalSignOut.jsx
"use client";
import { useRouter } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import { signOutAction } from "@/lib/actions";
import { signOut } from "next-auth/react"; // ✅ اضافه کن
import { useState } from "react";
import toast from "react-hot-toast";

function ModalSignOut({ showModal, setShowModal, isNextAuthUser = false }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Logging out...");

        try {
            if (isNextAuthUser) {
                // ✅ خروج از Google (NextAuth)
                await signOut({
                    redirect: false,
                    callbackUrl: "/login",
                });
                toast.success("Logged out successfully!", {
                    id: loadingToast,
                    duration: 2000,
                });
                setShowModal(false);
                router.push("/login");
                router.refresh();
            } else {
                // ✅ خروج از سیستم خودت
                await signOutAction();
                setShowModal(false);
                toast.success("Logged out successfully!", {
                    id: loadingToast,
                    duration: 2000,
                });
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed", {
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
                        Sign Out Confirmation
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
                    Are you sure you want to sign out? <br />
                    You&apos;ll need to log in again to access your account.
                </p>

                <div className="border-t pt-4 border-zinc-300 dark:border-zinc-700 flex gap-2 justify-end">
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSignOut}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging out..." : "Logout"}
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

export default ModalSignOut;
