"use client";

import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaHome, FaInfoCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { signOutAction } from "@/lib/actions";
import Logo from "./Logo";
import { IoWarning } from "react-icons/io5";
import SignOutButton from "./SignOutButton";

export default function MobileMenu({ user, session }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // تعیین وضعیت لاگین
    const hasSession = session?.user !== null && session?.user !== undefined;
    const hasCustomUser = user !== null && user !== undefined;
    const isLoggedIn = hasSession || hasCustomUser;
    const isNextAuthUser = hasSession;

    // اطلاعات کاربر برای نمایش
    const displayName = hasSession
        ? session.user.name
        : hasCustomUser
        ? user.name
        : null;

    const displayAvatar = hasSession
        ? session.user.image
        : hasCustomUser
        ? user.avatar || "/user.png"
        : null;

    const isActive = (href) => {
        if (href === "/" && pathname === "/") return true;
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    const handleLogout = async () => {
        setIsOpen(false);
        if (isNextAuthUser) {
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
        } else {
            await signOutAction();
            router.push("/");
            router.refresh();
        }
    };

    const menuItems = [
        { label: "Shop", href: "/collection", Icon: FaHome },
        { label: "About", href: "/about", Icon: FaInfoCircle },
    ];

    return (
        <>
            {/* دکمه همبرگری - فقط در موبایل */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden text-2xl text-black dark:text-white hover:text-amber-600 transition-colors"
                aria-label="Open menu"
            >
                <HiMenu className="w-15 h-15" />
            </button>

            {/* سایدبار منو */}
            <div
                className={`
                    fixed flex flex-col justify-between top-0 right-0 h-full w-80 z-50
                    bg-white dark:bg-zinc-900 shadow-2xl
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div>
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-2xl text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Close menu"
                        >
                            <HiX />
                        </button>
                    </div>

                    <div className="flex flex-col p-4 gap-2 mb-auto">
                        {isLoggedIn && (
                            <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                                {displayAvatar && (
                                    <div className="relative w-10 h-10">
                                        <Image
                                            src={displayAvatar}
                                            alt={displayName || "User"}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {displayName?.split(" ")[0] || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {hasSession
                                            ? "Google Account"
                                            : "Member"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* لینک‌های منو */}
                        {menuItems.map(({ label, href, Icon }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    transition-all duration-200
                                    ${
                                        active
                                            ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-medium"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    }
                                `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}

                        {/* لینک اکانت */}
                        {isLoggedIn && (
                            <Link
                                href="/account"
                                onClick={() => setIsOpen(false)}
                                className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg
                                transition-all duration-200
                                ${
                                    isActive("/account")
                                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-medium"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                }
                            `}
                            >
                                <FaUser className="w-5 h-5" />
                                <span>My Account</span>
                            </Link>
                        )}

                        {!isLoggedIn && (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg
                                transition-all duration-200
                                ${
                                    isActive("/login")
                                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-medium"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                }
                            `}
                            >
                                <FaUser className="w-5 h-5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="mx-auto py-10">
                    <Logo />
                </div>
            </div>

            {/* بک‌دراپ تار */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
