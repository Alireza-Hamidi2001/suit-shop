import Link from "next/link";
import { GiClick } from "react-icons/gi";
import main from "@/public/main.png";
import ScrollReveal from "./_components/ScrollReveal";

export default function Home() {
    return (
        <main className="">
            <div className="absolute font-lime text-6xl  left-4 bottom-50 sm:left-16 sm:bottom-16 w-[90%] md:w-[60%] lg:w-[50%]">
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
        </main>
    );
}
