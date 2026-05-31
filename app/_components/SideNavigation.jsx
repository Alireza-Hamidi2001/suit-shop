"use client";
import { FaHome, FaShoppingCart, FaUser, FaUserShield } from "react-icons/fa";
import SignOutButton from "./SignOutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    {
        name: "Home",
        href: "/account",
        icon: (
            <FaHome className="h-5 w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
        ),
    },
    {
        name: "Profile",
        href: "/account/profile",
        icon: (
            <FaUser className="h-5 w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
        ),
    },
];

function SideNavigation({ user, isNextAuthUser = false }) {
    // ✅ اضافه کن
    const pathName = usePathname();

    return (
        <nav className="border-r border-zinc-200 dark:border-zinc-800">
            <ul className="flex flex-col gap-2 h-full text-sm">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <Link
                            className={`py-3 px-5 transition-colors flex items-center gap-4 text-shadow-[0px_0px_3px] text-shadow-white dark:text-shadow-[1px_1px_7px] dark:text-shadow-black                            
                            text-black dark:text-gray-100 hover:bg-amber-100 italic dark:hover:bg-zinc-800
                            ${
                                pathName === link.href
                                    ? "border-l-4 border-amber-300 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-800"
                                    : ""
                            }`}
                            href={link.href}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    </li>
                ))}

                {user.role === "admin" && (
                    <li>
                        <Link
                            className={`py-3 px-5 transition-colors flex items-center gap-4 text-shadow-[0px_0px_3px] text-shadow-white dark:text-shadow-[1px_1px_7px] dark:text-shadow-black                            
                            text-black dark:text-gray-100 hover:bg-amber-100 italic dark:hover:bg-zinc-800
                            ${
                                pathName === "/account/management"
                                    ? "border-l-4 border-amber-300 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-800"
                                    : ""
                            }`}
                            href="/account/management"
                        >
                            <FaUserShield className="h-5 w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
                            Edit collection
                        </Link>
                    </li>
                )}
                {user.role === "user" && (
                    <li>
                        <Link
                            className={`py-3 px-5 transition-colors flex items-center gap-4 text-shadow-[0px_0px_3px] text-shadow-white dark:text-shadow-[1px_1px_7px] dark:text-shadow-black                            
                            text-black dark:text-gray-100 hover:bg-amber-100 italic dark:hover:bg-zinc-800
                            ${
                                pathName === "/account/order"
                                    ? "border-l-4 border-amber-300 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-800"
                                    : ""
                            }`}
                            href="/account/order"
                        >
                            <FaUserShield className="h-5 w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
                            Your orders
                        </Link>
                    </li>
                )}
                <li className="mt-auto">
                    {/* ✅ پاس دادن isNextAuthUser به SignOutButton */}
                    <SignOutButton isNextAuthUser={isNextAuthUser} />
                </li>
            </ul>
        </nav>
    );
}

export default SideNavigation;
