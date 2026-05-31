"use client";

import { IoWarning } from "react-icons/io5";

export default function Error({ error, reset }) {
    return (
        <main className="flex justify-center items-center flex-col gap-6">
            <h1 className="text-3xl tracking-wider uppercase flex flex-col items-center justify-center text-red-400">
                <IoWarning className="h-18 w-18 error" />
                Something went wrong!
            </h1>
            <p className="text-lg">
                <span className="text-md underline italic">&bull; Error </span>
                &nbsp;&nbsp; {error.message}
            </p>
            <button onClick={reset} className="button">
                Try again
            </button>
        </main>
    );
}
