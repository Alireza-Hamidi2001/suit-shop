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
                        <div className="text-sm grid gap-12 mt-6">
                            {suits.map((suit) => (
                                <div
                                    key={suit.id}
                                    className="flex flex-col gap-4 relative py-4 px-8 border-2 border-amber-200 dark:border-zinc-800 bg-amber-100 dark:bg-zinc-800 rounded-lg"
                                >
                                    <BtnEditHandler suit={suit} />

                                    <div className="grid grid-cols-1  sm:grid-cols-3 gap-8 sm:gap-2 items-center justify-center">
                                        <div className="relative w-64 h-64 sm:w-58 sm:h-58">
                                            <Image
                                                alt={suit.name}
                                                className="rounded-full object-cover"
                                                fill
                                                src={suit.image}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 col-span-2">
                                            <p className="paragraph">
                                                <span className="label text-teal-800 dark:text-teal-500">
                                                    Suit id
                                                    <br />
                                                </span>
                                                {suit.id}
                                            </p>
                                            <p className="paragraph">
                                                <span className="label text-teal-800 dark:text-teal-500">
                                                    Suit name
                                                    <br />
                                                </span>
                                                {suit.name}
                                            </p>
                                            <p className="paragraph">
                                                <span className="label text-teal-800 dark:text-teal-500">
                                                    price
                                                    <br />
                                                </span>
                                                ${suit.price}
                                            </p>
                                            <p className="paragraph">
                                                <span className="label text-teal-800 dark:text-teal-500">
                                                    discount
                                                    <br />
                                                </span>
                                                {suit.discount}%
                                            </p>
                                            <p className="paragraph">
                                                <span className="label text-teal-800 dark:text-teal-500">
                                                    fabric
                                                    <br />
                                                </span>
                                                {suit.fabric}
                                            </p>
                                            <p className="paragraph">
                                                <span className="label text-teal-800 dark:text-teal-500">
                                                    category
                                                    <br />
                                                </span>
                                                {suit.category === "male"
                                                    ? "Men"
                                                    : "Women"}
                                            </p>
                                        </div>
                                        <p className="col-span-2 md:col-span-3 lg:col-span-6 paragraph text-sm">
                                            <span className="label text-teal-800 dark:text-teal-500">
                                                description
                                                <br />
                                            </span>
                                            {suit.description}
                                        </p>
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
