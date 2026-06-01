import { getSuits } from "@/lib/data-service";
import { IoWarning } from "react-icons/io5";
import SuitCard from "./SuitCard";

async function SuitList({ filter }) {
    const suits = await getSuits();
    const hasSuits = suits && Array.isArray(suits) && suits.length > 0;

    let displayedSuits;
    if (hasSuits) {
        if (filter === "all") displayedSuits = suits;
        if (filter === "male")
            displayedSuits = suits.filter((suit) => suit.category === "male");
        if (filter === "female")
            displayedSuits = suits.filter((suit) => suit.category === "female");
    }
    const hasDisplayedSuits = displayedSuits?.length > 0;

    return (
        <>
            {hasDisplayedSuits ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedSuits.map((suit) => (
                        <SuitCard
                            suit={suit}
                            key={suit.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <IoWarning className="w-16 h-16 text-amber-500 mb-4" />
                    <p className="text-lg text-amber-700 dark:text-amber-400 font-medium">
                        {hasSuits
                            ? "No suits found in this category"
                            : "Our collection is currently being curated"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {hasSuits
                            ? "Please try another category or check back later."
                            : "Please visit us again soon to discover premium formal wear."}
                    </p>
                </div>
            )}
        </>
    );
}

export default SuitList;
