// src/app/layout.jsx
import { Suspense } from "react";
import { Toaster } from "react-hot-toast"; // ✅ اضافه کن
import Header from "./_components/Header";
import { ThemeProvider } from "./_components/ThemeProvider";
import {
    caveat,
    openSans,
    audioWide,
    kottaOne,
    courgette,
    coiny,
    arizonia,
    lime,
    comic,
} from "./fonts";

import "@/app/_styles/globals.css";
import Spinner from "./_components/Spinner";
import ToastProvider from "./_components/ToastProvider";

export const metadata = {
    title: {
        template: "%s | The Suit House",
        default: "Welcome | The Suit House",
    },
    description:
        "Premium formal wear for women and men. Timeless elegance, modern tailoring.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`text-[62.5%] md:text-[75%] lg:text-[100%]  ${lime.variable} ${comic.variable} ${caveat.variable} ${coiny.variable} ${openSans.variable} ${arizonia.variable} ${audioWide.variable} ${courgette.variable} ${kottaOne.variable}`}
            suppressHydrationWarning>
            <body
                className={`${openSans.className} bg-amber-50 dark:bg-zinc-950 flex flex-col min-h-screen`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    <div className=" text-primary-100">
                        <Suspense fallback={<Spinner />}>
                            <Header />
                        </Suspense>
                        <div className="flex-1 grid">
                            <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-15 lg:py-20 max-w-7xl mx-auto">
                                {children}
                            </main>
                        </div>
                    </div>
                </ThemeProvider>
                <ToastProvider />
            </body>
        </html>
    );
}
