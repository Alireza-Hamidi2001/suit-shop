"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaInfoCircle, FaUser, FaSignInAlt } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import Image from "next/image";

function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [pathname, router]);

    const isActive = (href) => {
        if (href === "/" && pathname === "/") return true;
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    const getMenuItems = () => {
        const items = [
            { label: "Shop", href: "/collection", Icon: FaHome },
            { label: "About", href: "/about", Icon: FaInfoCircle },
        ];

        if (!loading) {
            if (user) {
                items.push({
                    label: user.name.split(" ")[0],
                    href: "/account",
                    Icon: null,
                    avatar: user.avatar,
                });
            } else {
                items.push({ label: "Login", href: "/login", Icon: FaUser });
            }
        }

        return items;
    };

    const menuItems = getMenuItems();

    return (
        <nav className="z-10 text-md flex gap-16 items-center">
            <ul className="flex gap-8 items-center">
                {menuItems.map(({ label, href, Icon, avatar }) => {
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
                                {avatar ? (
                                    <div className="w-12 h-12 relative object-top">
                                        <Image
                                            src={avatar}
                                            alt={label}
                                            fill
                                            className="rounded-full border object-cover object-top border-amber-300 dark:border-amber-700"
                                        />
                                    </div>
                                ) : Icon ? (
                                    <Icon className="w-3 h-3" />
                                ) : null}
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <ThemeToggle />
        </nav>
    );
}

export default Navigation;

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FaHome, FaInfoCircle, FaUser } from "react-icons/fa";
// import { ThemeToggle } from "./ThemeToggle";

// function Navigation() {
//     const pathname = usePathname();

//     const menuItems = [
//         ["Shop", "collection", FaHome],
//         ["About", "about", FaInfoCircle],
//         ["User area", "account", FaUser],
//     ];

//     const isActive = (href) => {
//         if (href === "/" && pathname === "/") return true;
//         if (href !== "/" && pathname.startsWith(href)) return true;
//         return false;
//     };

//     return (
//         <nav className="z-10 text-md flex gap-16">
//             <ul className="flex gap-8">
//                 {menuItems.map(([label, href, Icon]) => {
//                     const active = isActive(`/${href}`);
//                     return (
//                         <li key={label}>
//                             <Link
//                                 href={`/${href}`}
//                                 className={`
//                                     navigation
//                                     ${
//                                         active
//                                             ? "font-semibold hover:font-semibold border-b border-amber-700 dark:border-amber-400 -translate-y-0.5 text-amber-700 pb-1 dark:text-amber-400"
//                                             : "text-black dark:text-gray-100 hover:-translate-y-0.5 hover:text-amber-700 dark:hover:text-gray-300"
//                                     }
//                                 `}
//                             >
//                                 <Icon
//                                     className={`w-3 h-3 ${
//                                         active
//                                             ? "text-amber-700 dark:text-amber-400"
//                                             : ""
//                                     }`}
//                                 />
//                                 {label}
//                             </Link>
//                         </li>
//                     );
//                 })}
//             </ul>
//             <ThemeToggle />
//         </nav>
//     );
// }

// export default Navigation;
