import { getSuitsPaginated } from "@/lib/data-service";
import { IoWarning } from "react-icons/io5";
import SuitCard from "./SuitCard";
import Pagination from "./SuitListPaginated";

async function SuitList({ filter, page = 1 }) {
    const limit = 6;
    const { suits, total, currentPage, totalPages } = await getSuitsPaginated(
        page,
        limit,
        filter,
    );

    const hasSuits = suits && suits.length > 0;

    return (
        <>
            {hasSuits ? (
                <>
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {suits.map((suit) => (
                            <SuitCard
                                suit={suit}
                                key={suit.id}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        filter={filter}
                    />

                    <div className="font-comic text-center text-sm text-gray-500 mt-4">
                        Showing {suits.length} of {total} products
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <IoWarning className="w-16 h-16 text-amber-500 mb-4" />
                    <p className="text-lg text-amber-700 dark:text-amber-400 font-medium">
                        {total === 0 && filter !== "all"
                            ? "No suits found in this category"
                            : "Our collection is currently being curated"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {total === 0 && filter !== "all"
                            ? "Please try another category or check back later."
                            : "Please visit us again soon to discover premium formal wear."}
                    </p>
                </div>
            )}
        </>
    );
}

export default SuitList;
