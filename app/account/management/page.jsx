import BtnEditHandler from "@/app/_components/BtnEditHandler";
import CreatePost from "@/app/_components/CreatePost";
import Spinner from "@/app/_components/Spinner";
import SuitList from "@/app/_components/SuitList";
import { getSuits } from "@/lib/data-service";
import Image from "next/image";
import { Suspense } from "react";

async function page({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const suits = await getSuits();
    const filter = resolvedSearchParams?.category ?? "all";
    return (
        <div>
            <Suspense
                fallback={<Spinner />}
                key={filter}
            >
                <CreatePost />
                <div className="text-sm grid gap-12">
                    {suits.map((suit) => (
                        <div
                            key={suit.id}
                            className="flex flex-col gap-4 relative py-4 px-8 border-2 border-amber-200 dark:border-zinc-800 bg-amber-100 dark:bg-zinc-800"
                        >
                            <BtnEditHandler suit={suit} />
                            <div className="w-32 h-32 relative">
                                <Image
                                    alt={suit.name}
                                    className="object-cover rounded-full"
                                    fill
                                    src={suit.image}
                                />
                            </div>
                            <div className="grid grid-cols-6 gap-4 justify-center paragraph text-sm">
                                <p>
                                    <span className="font-bold italic font-comic ">
                                        Suit id <br />
                                    </span>
                                    {suit.id}
                                </p>
                                <p>
                                    <span className="font-bold italic font-comic">
                                        Suit name <br />
                                    </span>
                                    {suit.name}
                                </p>
                                <p>
                                    <span className="font-bold italic font-comic">
                                        price <br />
                                    </span>
                                    ${suit.price}
                                </p>
                                <p>
                                    <span className="font-bold italic font-comic">
                                        discount <br />
                                    </span>
                                    {suit.discount}%
                                </p>
                                <p>
                                    <span className="font-bold italic font-comic">
                                        fabric <br />
                                    </span>
                                    {suit.fabric}
                                </p>
                                <p>
                                    <span className="font-bold italic font-comic">
                                        category <br />
                                    </span>
                                    {suit.category === "male" ? "Men" : "Women"}
                                </p>
                                <p className="col-span-2 md:col-span-3 lg:col-span-6">
                                    <span className="font-bold italic font-comic">
                                        description : <br />
                                    </span>
                                    {suit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Suspense>
        </div>
    );
}

export default page;
