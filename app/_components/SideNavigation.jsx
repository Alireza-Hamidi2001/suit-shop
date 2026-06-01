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
            <FaHome className="h-8 w-8 md:h-5 md:w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
        ),
    },
    {
        name: "Profile",
        href: "/account/profile",
        icon: (
            <FaUser className="h-8 w-8 md:h-5 md:w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
        ),
    },
];

function SideNavigation({ user, isNextAuthUser = false }) {
    // ✅ اضافه کن
    const pathName = usePathname();

    return (
        <nav className="border-r border-zinc-200 dark:border-zinc-800">
            <ul className="flex flex-col gap-6 sm:gap-4 md:gap-2 h-full text-sm">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <Link
                            className={`p-2 md:py-3 md:px-5 transition-colors flex items-center gap-4 text-shadow-[0px_0px_3px] text-shadow-white dark:text-shadow-[1px_1px_7px] dark:text-shadow-black                            
                            text-black dark:text-gray-100 hover:bg-amber-100 italic dark:hover:bg-zinc-800
                            ${
                                pathName === link.href
                                    ? "border-r-2 sm:border-l-4  border-amber-300 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-800"
                                    : ""
                            }`}
                            href={link.href}
                        >
                            {link.icon}
                            <p className="hidden sm:block">{link.name}</p>
                        </Link>
                    </li>
                ))}

                {user.role === "admin" && (
                    <li>
                        <Link
                            className={`p-2 md:py-3 md:px-5 transition-colors flex items-center gap-4 text-shadow-[0px_0px_3px] text-shadow-white dark:text-shadow-[1px_1px_7px] dark:text-shadow-black                            
                            text-black dark:text-gray-100 hover:bg-amber-100 italic dark:hover:bg-zinc-800
                            ${
                                pathName === "/account/management"
                                    ? "border-l-4 border-amber-300 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-800"
                                    : ""
                            }`}
                            href="/account/management"
                        >
                            <FaUserShield className="h-8 w-8 md:h-5 md:w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
                            <p className="hidden sm:block">Edit collection</p>
                        </Link>
                    </li>
                )}
                {user.role === "user" && (
                    <li>
                        <Link
                            className={`p-2 md:py-3 md:px-5 transition-colors flex items-center gap-4 text-shadow-[0px_0px_3px] text-shadow-white dark:text-shadow-[1px_1px_7px] dark:text-shadow-black                            
                            text-black dark:text-gray-100 hover:bg-amber-100 italic dark:hover:bg-zinc-800
                            ${
                                pathName === "/account/order"
                                    ? "border-l-4 border-amber-300 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-800"
                                    : ""
                            }`}
                            href="/account/order"
                        >
                            <FaUserShield className="h-8 w-8 md:h-5 md:w-5 text-black dark:text-gray-100 hover:text-blue-800 italic dark:hover:text-cyan-500" />
                            <p className="hidden sm:block">Your orders</p>
                        </Link>
                    </li>
                )}
                <li className="mt-auto">
                    <SignOutButton isNextAuthUser={isNextAuthUser} />
                </li>
            </ul>
        </nav>
    );
}

export default SideNavigation;
