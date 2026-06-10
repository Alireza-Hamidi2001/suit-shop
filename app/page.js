import Link from "next/link";
import { GiClick } from "react-icons/gi";
import ScrollReveal from "./_components/ScrollReveal";
import InfiniteGallery from "./_components/InfiniteGallery";

export default function Home() {
    return (
        <main className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="relative py-8 sm:py-0 font-lime text-6xl">
                <ScrollReveal direction="right" className="flex-1 space-y-6">
                    <h1 className="bg-dark text-black dark:text-white">
                        Timeless Elegance, Tailored for You
                    </h1>
                </ScrollReveal>
                <ScrollReveal direction="left" className="flex-1 space-y-6">
                    <button className="button open-sans p-2 text-lg">
                        <Link href="/collection">
                            <span className="relative flex gap-2 items-center z-10">
                                Shop Collection
                                <GiClick className="clickAnimation w-5 h-5" />
                            </span>
                        </Link>
                    </button>
                </ScrollReveal>
            </div>
            <div className="w-full">
                <InfiniteGallery />
            </div>
        </main>
    );
}
