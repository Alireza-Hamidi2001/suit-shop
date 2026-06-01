// app/about/page.js
import Link from "next/link";
import aboutImage1 from "@/public/suits/about-001.png";
import aboutImage2 from "@/public/suits/about-002.png";
import aboutImage3 from "@/public/suits/about-003.png";

import { HiCheck } from "react-icons/hi";
import { FaCut } from "react-icons/fa";
import { TbArrowsExchange } from "react-icons/tb";
import { GiClick } from "react-icons/gi";

import Image from "next/image";
import Footer from "../_components/Footer";
import { StaggerContainer, StaggerItem } from "../_components/StaggerWrapper";
import ScrollReveal from "../_components/ScrollReveal";
// import { StaggerContainer, StaggerItem } from "@/components/StaggerWrapper";

export const metadata = {
    title: "About",
};

export default function Page() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* ========== بخش اول ========== */}
                <div className="grid grid-cols-1 md:grid-cols-2 px-10 sm:px-0 gap-16 items-center mb-32">
                    <ScrollReveal
                        direction="left"
                        delay={0.1}
                        className="flex-1 space-y-6"
                    >
                        <div className="inline-block">
                            <span className="subHeading">&bull; About Us</span>
                            <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
                        </div>
                        <h1 className="title">
                            Welcome to{" "}
                            <span className="font-semibold">Suitelier</span>
                        </h1>
                        <StaggerContainer delay={0.2}>
                            <StaggerItem>
                                <p className="paragraph">
                                    Suitelier was born from a simple yet
                                    powerful idea: that formal wear should not
                                    be defined by gender, but by elegance, fit,
                                    and confidence. We are a modern fashion
                                    house dedicated to crafting premium suits,
                                    blazers, and tailored separates for both
                                    women and men.
                                </p>
                            </StaggerItem>
                            <StaggerItem>
                                <p className="paragraph">
                                    Our journey began with a commitment to break
                                    traditional boundaries and offer
                                    sophisticated dressing for every body type
                                    and personal style. At Suitelier, we believe
                                    that a well-tailored suit is more than just
                                    clothing — it is a statement of purpose,
                                    ambition, and self-respect.
                                </p>
                            </StaggerItem>
                            <StaggerItem>
                                <p className="paragraph">
                                    Every piece in our collection is designed
                                    with meticulous attention to detail, from
                                    the stitching to the silhouette. We source
                                    the finest fabrics from Italy, England, and
                                    Japan to ensure durability, comfort, and
                                    luxury.
                                </p>
                            </StaggerItem>
                        </StaggerContainer>
                    </ScrollReveal>

                    <ScrollReveal
                        direction="right"
                        delay={0.2}
                        className="flex-1 relative image-shadow-light dark:image-shadow-dark aspect-4/5 overflow-hidden"
                    >
                        <Image
                            src={aboutImage1}
                            fill
                            className="object-cover hover:scale-105 transition duration-700 rounded-lg"
                            placeholder="blur"
                            alt="Luxury suits collection at Suitelier"
                        />
                    </ScrollReveal>
                </div>

                {/* ========== بخش دوم ========== */}
                <div className="grid grid-cols-1 md:grid-cols-2 px-10 sm:px-0 gap-16 items-center mb-32">
                    {/* عکس - در ستون اول (چپ) */}
                    <ScrollReveal
                        direction="left"
                        delay={0.2}
                        className="relative image-shadow-light dark:image-shadow-dark aspect-4/5 overflow-hidden rounded-xl order-1 md:order-1"
                    >
                        <Image
                            src={aboutImage2}
                            fill
                            className="object-cover hover:scale-105 transition duration-700"
                            placeholder="blur"
                            alt="Suitelier tailoring team at work"
                        />
                    </ScrollReveal>

                    {/* متن - در ستون دوم (راست) */}
                    <ScrollReveal
                        direction="right"
                        delay={0.1}
                        className="space-y-6 order-2 md:order-2"
                    >
                        <div className="inline-block">
                            <span className="subHeading">
                                &bull; Our Heritage
                            </span>
                            <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
                        </div>
                        <h1 className="title">
                            Craftsmanship Since{" "}
                            <span className="font-semibold">2010</span>
                        </h1>
                        <StaggerContainer delay={0.2}>
                            <StaggerItem>
                                <p className="paragraph">
                                    Our team of skilled tailors and designers
                                    work together to bring you contemporary
                                    styles that respect classic tailoring
                                    traditions. Whether you are preparing for a
                                    boardroom presentation, a wedding ceremony,
                                    or an evening gala, Suitelier ensures you
                                    arrive looking your absolute best.
                                </p>
                            </StaggerItem>
                            <StaggerItem>
                                <p className="paragraph">
                                    We are not just a store; we are a
                                    destination for those who refuse to
                                    compromise on quality or style. Our
                                    collection features everything from classic
                                    navy blazers and charcoal business suits to
                                    bold statement pieces and elegant tuxedos.
                                </p>
                            </StaggerItem>
                            <StaggerItem>
                                <p className="paragraph">
                                    For women, we offer power suits with
                                    feminine cuts, wide-leg trousers, and
                                    tailored blazers that command attention. For
                                    men, our range includes slim-fit,
                                    regular-fit, and modern silhouettes in wool,
                                    linen, and cotton blends.
                                </p>
                            </StaggerItem>
                        </StaggerContainer>
                        <div>
                            <button className="button">
                                <Link href="/collection">
                                    <span className="relative flex gap-2 items-center z-10">
                                        Shop Collection
                                        <GiClick className="clickAnimation w-5 h-5" />
                                    </span>
                                </Link>
                            </button>
                        </div>
                    </ScrollReveal>
                </div>

                {/* ========== بخش سوم ========== */}
                <ScrollReveal
                    direction="up"
                    delay={0.1}
                >
                    <div className="bg-amber-100 dark:bg-zinc-900 p-4 md:p-8 lg:p-12  rounded-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="lg:order-2 relative image-shadow-light dark:image-shadow-dark aspect-4/3 overflow-hidden rounded-xl shadow-lg">
                                <div className="absolute inset-0 bg-black/20 z-10 rounded-lg"></div>
                                <Image
                                    src={aboutImage3}
                                    fill
                                    className="object-cover hover:scale-105 transition duration-700"
                                    placeholder="blur"
                                    alt="Quality inspection of suits at Suitelier"
                                />
                                <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <p className="text-sm font-semibold text-black">
                                        Quality Assured ✓
                                    </p>
                                </div>
                            </div>

                            <div className="lg:order-1 space-y-6">
                                <div className="inline-block">
                                    <span className="subHeading">
                                        &bull; Our Promise
                                    </span>
                                    <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
                                </div>
                                <h1 className="title">
                                    Guaranteed{" "}
                                    <span className="font-semibold">
                                        Quality
                                    </span>
                                </h1>

                                <StaggerContainer delay={0.2}>
                                    <StaggerItem>
                                        <p>
                                            At Suitelier, every suit that leaves
                                            our atelier undergoes a rigorous
                                            25-point quality inspection. From
                                            thread tension to button alignment,
                                            we leave nothing to chance. Our
                                            master tailors personally check each
                                            garment to ensure it meets our
                                            exacting standards before it reaches
                                            your wardrobe.
                                        </p>
                                    </StaggerItem>
                                    <StaggerItem>
                                        <p>
                                            We stand behind every piece we sell
                                            with our{" "}
                                            <strong className="font-semibold">
                                                365-day quality guarantee
                                            </strong>
                                            . If you discover any manufacturing
                                            defect — loose stitching, faulty
                                            zippers, or fabric irregularities —
                                            we will repair or replace your suit
                                            at no cost. No questions asked.
                                        </p>
                                    </StaggerItem>
                                    <StaggerItem>
                                        <p>
                                            Your satisfaction is our reputation.
                                            That&apos;s why we offer a{" "}
                                            <strong className="font-semibold">
                                                14-day risk-free return policy
                                            </strong>
                                            . If your suit doesn&apos;t fit
                                            perfectly or you simply change your
                                            mind, return it for a full refund or
                                            exchange. We also provide free
                                            alterations within 30 days of
                                            purchase to ensure your suit fits
                                            like it was made for you.
                                        </p>
                                    </StaggerItem>
                                </StaggerContainer>

                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="text-center">
                                        <div className="w-20 h-20 md:w-15 md:h-15 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <HiCheck className="w-15 h-15 md:w-12 md:h-12 text-white" />
                                        </div>
                                        <p className="text-xs font-medium">
                                            Quality Checked
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 h-20 md:w-15 md:h-15 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <TbArrowsExchange className="w-15 h-15 md:w-12 md:h-12 text-white" />
                                        </div>
                                        <p className="text-xs font-medium">
                                            14 Days Return
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 h-20 md:w-15 md:h-15 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <FaCut className="w-13 h-13 md:w-10 md:h-10 text-white" />
                                        </div>
                                        <p className="text-xs font-medium">
                                            Free Alterations
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <button className="button flex items-center gap-2">
                                        Learn About Our Guarantee
                                        <GiClick className="clickAnimation w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
            <Footer />
        </>
    );
}
