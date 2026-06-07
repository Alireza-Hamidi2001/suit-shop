"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Footer from "../_components/Footer";
import Link from "next/link";

function Page() {
    const router = useRouter();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ اعتبارسنجی سمت کلاینت
    const validateForm = () => {
        if (!fullname.trim()) {
            toast.error("Full name is required");
            return false;
        }
        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!password.trim()) {
            toast.error("Password is required");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;
        setLoading(true);
        const loadingToast = toast.loading("Creating your account...");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullname,
                    email,
                    password,
                    phone: phone || null, // اگر خالی بود null بفرست
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // ✅ موفقیت
            toast.success(
                "Account created successfully . Redirecting to login...",
                {
                    id: loadingToast,
                    duration: 6000,
                },
            );

            setFullname("");
            setEmail("");
            setPassword("");
            setPhone("");

            // ✅ هدایت به صفحه لاگین بعد از 2 ثانیه
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (err) {
            toast.error(err.message, {
                id: loadingToast,
                duration: 4000,
            });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto p-6 bg-white dark:border-zinc-800 rounded-lg shadow">
                <h1 className="text-5xl tracking-wide pb-5 mb-5 text-center border-b border-zinc-300 dark:border-zinc-800 font-courgette">
                    Sign-up
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form
                    className="grid grid-cols-2 gap-4"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4 col-span-2 md:col-span-1">
                        <label className="label">&mdash; Fullname *</label>
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="input"
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="mb-4 col-span-2 md:col-span-1">
                        <label className="label">&mdash; Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="mb-6 col-span-2 md:col-span-1">
                        <label className="label">&mdash; Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                            placeholder="Atleast 6"
                        />
                    </div>

                    <div className="mb-6 col-span-2 md:col-span-1">
                        <label className="label">
                            &mdash; Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="loginBtn col-span-2"
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                    <div className="col-span-2 text-center text-sm mt-2">
                        <Link
                            href="/login"
                            className="paragraph text-[0.8rem] dark:hover:text-amber-300 transition-colors"
                        >
                            Already have an account ? Login
                        </Link>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default Page;
