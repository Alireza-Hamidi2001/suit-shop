// src/app/_components/ToastProvider.jsx
"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToastProvider() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 4000,
                style: {
                    background: isDark ? "#2d2d2d" : "#4a4a4a",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "12px 16px",
                    fontSize: "14px",
                },
                success: {
                    duration: 4000,
                    style: {
                        background: isDark ? "#0a3b2a" : "#10B981",
                        color: "#ffffff",
                        borderRadius: "5px",
                    },
                    iconTheme: {
                        primary: "#ffffff",
                        secondary: isDark ? "#0a3b2a" : "#10B981",
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: isDark ? "#7a1a1a" : "#EF4444",
                        color: "#ffffff",
                        borderRadius: "5px",
                    },
                    iconTheme: {
                        primary: "#ffffff",
                        secondary: isDark ? "#7a1a1a" : "#EF4444",
                    },
                },
                loading: {
                    style: {
                        background: isDark ? "#3d3d3d" : "#f5f5f5",
                        color: isDark ? "#ffffff" : "#1a1a1a",
                        borderRadius: "5px",
                    },
                },
            }}
        />
    );
}
