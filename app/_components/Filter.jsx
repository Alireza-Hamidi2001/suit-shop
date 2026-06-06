"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();
    const activeFilter = searchParams.get("category") ?? "all";

    const filterItems = [
        { id: 1, name: "All suits", filter: "all" },
        { id: 2, name: "Gentlemen", filter: "male" },
        { id: 3, name: "Ladies", filter: "female" },
        { id: 4, name: "Palto", filter: "palto" },
        { id: 5, name: "Shirt", filter: "shirt" },
        { id: 6, name: "Vest", filter: "vest" },
    ];
    function handleFilter(filter) {
        console.log(filter);
        const params = new URLSearchParams(searchParams);
        params.set("category", filter);
        router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="flex items-center gap-2 p-1 bg-amber-50 dark:bg-zinc-900 rounded-full shadow-md border border-amber-200 dark:border-zinc-700 w-fit mb-8">
            {filterItems.map((filterItem) => (
                <Button
                    key={filterItem.id}
                    filter={filterItem.filter}
                    handleFilter={handleFilter}
                    activeFilter={activeFilter}
                >
                    {filterItem.name}
                </Button>
            ))}
        </div>
    );
}

function Button({ filter, handleFilter, activeFilter, children }) {
    const isActive = filter === activeFilter;

    return (
        <button
            onClick={() => handleFilter(filter)}
            className={`
                font-comic text-sm font-normal md:font-medium tracking-wide
                px-2 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300
                ${
                    isActive
                        ? "bg-amber-600 text-white shadow-md shadow-amber-200 dark:shadow-amber-900/30 scale-105"
                        : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-zinc-800 hover:text-amber-700 dark:hover:text-amber-400"
                }
            `}
        >
            {children}
        </button>
    );
}

export default Filter;
