import { Suspense } from "react";
import SuitList from "../_components/SuitList";
import Spinner from "../_components/Spinner";
import Footer from "../_components/Footer";
import Filter from "../_components/Filter";
import ScrollReveal from "../_components/ScrollReveal";

export const metadata = {
    title: "Collection | Premium Formal Wear",
    description:
        "Discover premium suits for women and men. Timeless elegance, modern tailoring.",
};

export default async function Page({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const filter = resolvedSearchParams?.category ?? "all";

    return (
        <>
            <div className="w-full">
                <ScrollReveal>
                    <div className="mb-16">
                        <span className="subHeading">&bull; Suitelier</span>
                        <div className="w-12 h-0.5 bg-amber-600 mt-2 mb-4"></div>
                        <h1 className="title">
                            Premium{" "}
                            <span className="font-semibold">Formal Wear</span>
                        </h1>
                        <p className="paragraph max-w-2xl">
                            Discover our curated collection of tailored suits
                            for women and men. Crafted with precision and
                            designed for confidence.
                        </p>
                    </div>
                </ScrollReveal>
                <Filter />

                <Suspense
                    fallback={<Spinner />}
                    key={filter}
                >
                    <SuitList filter={filter} />
                </Suspense>
            </div>
            <Footer />
        </>
    );
}
