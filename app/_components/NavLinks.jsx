"use client";

import { FaHome, FaInfoCircle, FaUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ user: initialUser, session }) {
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === "/" && pathname === "/") return true;
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    const mainMenus = [
        { label: "Shop", href: "/collection", Icon: FaHome },
        { label: "About", href: "/about", Icon: FaInfoCircle },
    ];

    // تعیین اینکه از کدام روش استفاده کنه (اولویت با session از NextAuth)
    const hasSession = session?.user !== null && session?.user !== undefined;
    const hasCustomUser = initialUser !== null && initialUser !== undefined;

    // اطلاعات نهایی برای نمایش
    const displayName = hasSession
        ? session.user.name
        : hasCustomUser
        ? initialUser.name
        : null;

    const displayAvatar = hasSession
        ? session.user.image
        : hasCustomUser
        ? initialUser.avatar || "/user.png"
        : null;

    const isLoggedIn = hasSession || hasCustomUser;

    return (
        <ul className="flex gap-8 items-center">
            {/* منوهای اصلی */}
            {mainMenus.map(({ label, href, Icon }) => {
                const active = isActive(href);
                return (
                    <li key={label}>
                        <Link
                            href={href}
                            className={`
                                navigation text-[0.7rem] tracking-widest
                                transition-all duration-300 
                                flex items-center gap-1
                                ${
                                    active
                                        ? "font-semibold border-b border-amber-700 dark:border-amber-400 -translate-y-0.5 text-amber-700 pb-1 dark:text-amber-400"
                                        : "text-black dark:text-gray-100 hover:-translate-y-0.5 hover:text-amber-700 dark:hover:text-gray-300"
                                }
                            `}
                        >
                            <Icon className="w-3 h-3" />
                            {label}
                        </Link>
                    </li>
                );
            })}

            {/* بخش کاربر (لاگین شده) - بدون دکمه خروج */}
            {isLoggedIn ? (
                <li>
                    <Link
                        href="/account"
                        className={`
                            navigation text-[0.7rem] tracking-widest
                            transition-all duration-300 
                            flex items-center gap-2
                            ${
                                isActive("/account")
                                    ? "font-semibold -translate-y-0.5 text-amber-700 dark:text-amber-400"
                                    : "text-black dark:text-gray-100 hover:text-amber-700 dark:hover:text-gray-300"
                            }
                        `}
                    >
                        <div className="flex items-center gap-2">
                            {displayAvatar && (
                                <div className="relative w-7 h-7">
                                    <Image
                                        src={displayAvatar}
                                        alt={displayName || "User"}
                                        fill
                                        className="rounded-full object-cover object-top"
                                        priority={false}
                                    />
                                </div>
                            )}
                            <span className="text-sm">
                                {displayName?.split(" ")[0] || "User"}
                            </span>
                        </div>
                    </Link>
                </li>
            ) : (
                <li>
                    <Link
                        href="/login"
                        className={`
                            navigation text-[0.7rem] tracking-widest
                            transition-all duration-300 
                            flex items-center gap-1
                            ${
                                isActive("/login")
                                    ? "font-semibold border-b border-amber-700 dark:border-amber-400 -translate-y-0.5 text-amber-700 pb-1 dark:text-amber-400"
                                    : "text-black dark:text-gray-100 hover:-translate-y-0.5 hover:text-amber-700 dark:hover:text-gray-300"
                            }
                        `}
                    >
                        <FaUser className="w-3 h-3" />
                        Login
                    </Link>
                </li>
            )}
        </ul>
    );
}
