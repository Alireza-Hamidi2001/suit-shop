"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";
import Spinner from "../_components/Spinner";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // ✅ بررسی کاربر قبلاً لاگین کرده یا نه
    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    toast.success("Welcome back!");
                    router.replace("/account");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Network error. Please try again.");
            })
            .finally(() => setChecking(false));
    }, [router]);

    // در حال بررسی وضعیت لاگین
    if (checking) {
        return (
            <div className="flex flex-col justify-center items-center">
                <IoWarning className="text-yellow-600 mb-4 h-14 w-14 error" />
                <p className="text-yellow-600 text-2xl mb-16">
                    Checking authentication ...
                </p>
                <Spinner />
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // setError("");

        const loadingToast = toast.loading("Logging in...");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid email or password");
            }

            // ✅ همون toast رو به success تبدیل کن (با id یکسان)
            toast.success("Login successful.", {
                id: loadingToast,
                duration: 4000,
            });

            // ✅ بعد از اینکه کاربر پیام رو دید، ریدایرکت کن
            setTimeout(() => {
                router.push("/account");
                router.refresh();
            }, 1000);
        } catch (err) {
            // ✅ همون toast رو به error تبدیل کن
            toast.error(err.message, {
                id: loadingToast,
                duration: 4000,
            });
            // setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mb-60 sm:mb-20 mx-auto p-6 bg-amber-100 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-700 rounded-lg shadow">
            <h1 className="text-6xl tracking-wide pb-5 mb-5 text-center border-b border-zinc-300 dark:border-zinc-800 font-caveat">
                Login
            </h1>

            <form
                className="grid gap-4 grid-cols-2"
                onSubmit={handleSubmit}
            >
                <div className="mb-4 col-span-2">
                    <label className="label">&mdash; Email *</label>
                    <input
                        placeholder="example@gmail.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                    />
                </div>

                <div className="mb-6 col-span-2">
                    <label className="label">&mdash; Password *</label>
                    <input
                        placeholder="••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="loginBtn col-span-2"
                >
                    {loading ? "Logging in ..." : "Login"}
                </button>

                <Link
                    className="tracking-wide flex gap-2 items-center justify-center text-[0.8rem] col-span-2"
                    href="/signup"
                >
                    Don&apos;t have an account yet ?{" "}
                    <span className="font-courgette text-[1rem] tracking-wider">
                        {" "}
                        Sign up &rarr;{" "}
                    </span>
                </Link>
            </form>
        </div>
    );
}
