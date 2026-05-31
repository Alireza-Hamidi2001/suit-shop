"use client";
import Link from "next/link";
import { IoWarning } from "react-icons/io5";

// export const metadata = {
//     title: "NOT FOUND",
// };

function NotFound() {
    return (
        <main className="flex justify-center items-center flex-col gap-6">
            <h1 className="text-3xl tracking-wider uppercase flex flex-col items-center justify-center text-red-400">
                <IoWarning className="h-18 w-18" />
                This page could not be found
            </h1>
            <Link href="/" className="button">
                Go back home
            </Link>
        </main>
    );
}

export default NotFound;
