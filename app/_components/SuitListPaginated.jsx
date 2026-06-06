"use client";

import { useRouter, usePathname } from "next/navigation";

function Pagination({ currentPage, totalPages, filter }) {
    const router = useRouter();
    const pathname = usePathname();

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            const params = new URLSearchParams();
            params.set("category", filter);
            params.set("page", page);
            router.push(`${pathname}?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                &larr;
            </button>

            <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-full transition-colors ${
                                currentPage === page
                                    ? "bg-amber-600 text-white"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            {page}
                        </button>
                    ),
                )}
            </div>

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                &rarr;
            </button>
        </div>
    );
}

export default Pagination;
