import BtnEditHandler from "@/app/_components/BtnEditHandler";
import CreatePost from "@/app/_components/CreatePost";
import Filter from "@/app/_components/Filter";
import Spinner from "@/app/_components/Spinner";
import Pagination from "@/app/_components/SuitListPaginated";
import { getSuitsPaginated } from "@/lib/data-service";
import Image from "next/image";
import { Suspense } from "react";

async function ManagementPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const limit = 6;
    const filter = resolvedSearchParams?.category ?? "all";
    const page = parseInt(resolvedSearchParams?.page) || 1;

    const { suits, total, currentPage, totalPages } = await getSuitsPaginated(
        page,
        limit,
        filter,
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="title text-3xl mb-0">Manage Collection</h1>
                <CreatePost />
            </div>

            <Filter />

            <Suspense
                key={`${filter}-${page}`}
                fallback={<Spinner />}
            >
                {suits.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No products found in this category.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 mt-6">
                            {suits.map((suit) => (
                                <div
                                    key={suit.id}
                                    className="relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                >
                                    <BtnEditHandler suit={suit} />

                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* بخش عکس */}
                                            <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                                                <Image
                                                    alt={suit.name}
                                                    className="rounded-lg object-cover"
                                                    fill
                                                    src={suit.image}
                                                />
                                            </div>

                                            {/* بخش اطلاعات اصلی */}
                                            <div className="flex-1">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                            Suit ID
                                                        </span>
                                                        <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">
                                                            {suit.id}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                            Suit Name
                                                        </span>
                                                        <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">
                                                            {suit.name}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                            Price
                                                        </span>
                                                        <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">
                                                            ${suit.price}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                            Discount
                                                        </span>
                                                        <p className="text-green-600 dark:text-green-400 font-medium mt-1">
                                                            {suit.discount}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                            Fabric
                                                        </span>
                                                        <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">
                                                            {suit.fabric}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                            Category
                                                        </span>
                                                        <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">
                                                            {suit.category ===
                                                            "male"
                                                                ? "Men"
                                                                : "Women"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* توضیحات */}
                                                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                        Description
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                                                        {suit.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                filter={filter}
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500 mt-4">
                            Showing {suits.length} of {total} products
                        </div>
                    </>
                )}
            </Suspense>
        </div>
    );
}

export default ManagementPage;
