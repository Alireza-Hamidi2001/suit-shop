"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // جلوگیری از خطای hydration در سمت سرور
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg hover:scale-1.2 duration-200 transition-all"
        >
            {theme === "dark" ? (
                <FiSun className="w-5 h-5" />
            ) : (
                <FaMoon className="w-5 h-5 text-black" />
            )}
        </button>
    );
}
