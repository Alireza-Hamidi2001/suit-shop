// app/collection/[suitid]/page.js
// صفحه نمایش جزئیات یک محصول (کت شلوار) بر اساس آیدی

import { Suspense } from "react";
import { IoShirtOutline, IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import {
    FaRulerCombined,
    FaTruck,
    FaShieldAlt,
    FaExchangeAlt,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

import { getSuit, getSuitPrice } from "@/lib/data-service";
import { getCurrentUser } from "@/lib/auth"; // ✅ اضافه شد
import Footer from "@/app/_components/Footer";
import AddToCartButton from "@/app/_components/AddToCartButton"; // ✅ کامپوننت جدید
import {
    StaggerContainer,
    StaggerItem,
} from "@/app/_components/StaggerWrapper";
import ScrollReveal from "@/app/_components/ScrollReveal";

// ========== META DATA ==========
export async function generateMetadata({ params }) {
    const { suitid } = await params;
    const suitId = parseInt(suitid);

    const suit = await getSuit(suitId);

    if (!suit) {
        return {
            title: "Product Not Found | Suitelier",
            description: "The requested product does not exist.",
        };
    }

    return {
        title: `${suit.name} | Suitelier`,
        description: suit.description?.slice(0, 160),
    };
}

async function DynamicPrice({ suitId }) {
    const priceData = await getSuitPrice(suitId);

    if (!priceData) return null;

    const hasDiscount = priceData.discount > 0;

    return (
        <div className="flex items-baseline gap-3">
            {hasDiscount ? (
                <>
                    <span className="font-comic text-4xl font-bold text-amber-600">
                        ${priceData.finalPrice.toFixed(2)}
                    </span>
                    <span className="line-through text-gray-400 text-lg">
                        ${priceData.originalPrice.toFixed(2)}
                    </span>
                    <span className="font-comic bg-red-700 dark:bg-red-500 text-red-100 text-[0.7rem] px-2 py-1 rounded-full">
                        -{priceData.discount} %
                    </span>
                </>
            ) : (
                <span className="text-4xl font-bold text-gray-800 dark:text-white">
                    ${priceData.originalPrice.toFixed(2)}
                </span>
            )}
        </div>
    );
}

// ========== کامپوننت دکمه‌های اقدام (بر اساس وضعیت لاگین) ==========
function ActionButtons({ suitId, user }) {
    // اگر کاربر لاگین کرده باشد، دکمه Add to Cart نمایش داده می‌شود
    if (user) {
        return (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <AddToCartButton suitId={suitId} />
                <Link
                    href="/collection"
                    className="backButton inline-flex items-center justify-center"
                >
                    Back to Collection
                </Link>
            </div>
        );
    }

    // اگر کاربر لاگین نکرده باشد، پیام لاگین و لینک به صفحه لاگین نمایش داده می‌شود
    return (
        <div className="mt-6">
            <div className="bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 rounded-lg p-6 text-center">
                <p className="text-amber-700 dark:text-amber-300 mb-3">
                    &bull; Please login to add items to your cart
                </p>
                <Link
                    href={`/login?redirect=/collection/${suitId}`}
                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition duration-300"
                >
                    Login to Continue
                </Link>
                <div className="mt-4">
                    <Link
                        href="/collection"
                        className="backButton inline-flex items-center justify-center"
                    >
                        Back to Collection
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StaticSuitInfo({ suit, suitId, user }) {
    const { name, image, description, fabric } = suit;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="relative aspect-[4/4] overflow-hidden rounded-xl bg-amber-100 dark:bg-zinc-900">
                <Image
                    src={image || "/suits/suit-placeholder.jpg"}
                    fill
                    alt={`Suit ${name}`}
                    className="object-cover hover:scale-105 transition duration-500"
                    priority
                />
            </div>

            <div>
                <h1 className="title text-4xl bg-amber-50 dark:bg-zinc-950 rounded-sm lg:-translate-x-46 p-6 w-[120%] lg:text-5xl mb-4">
                    <ScrollReveal direction="right">{name}</ScrollReveal>
                </h1>
                <StaggerContainer>
                    <StaggerItem>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <FaRulerCombined className="h-4 w-4" />
                            <span className="text-sm">Fabric: </span>
                            <span className="font-semibold">
                                {fabric || "Premium Wool"}
                            </span>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <p className="paragraph indent-6 text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                            {description}
                        </p>
                    </StaggerItem>

                    <ul className="space-y-3 mb-8">
                        <StaggerItem>
                            <li className="flex items-center gap-3 text-sm">
                                <IoCheckmarkCircle className="h-7 w-7 text-green-500" />
                                <span>100% genuine premium fabric</span>
                            </li>
                        </StaggerItem>
                        <StaggerItem>
                            <li className="flex items-center gap-3 text-sm">
                                <IoCheckmarkCircle className="h-7 w-7 text-green-500" />
                                <span>Tailored fit for maximum comfort</span>
                            </li>
                        </StaggerItem>
                        <StaggerItem>
                            <li className="flex items-center gap-3 text-sm">
                                <IoCheckmarkCircle className="h-7 w-7 text-green-500" />
                                <span>
                                    Free worldwide shipping on orders over $200
                                </span>
                            </li>
                        </StaggerItem>
                        <StaggerItem>
                            <li className="flex items-center gap-3 text-sm">
                                <IoCheckmarkCircle className="h-7 w-7 text-green-500" />
                                <span>30-day easy return policy</span>
                            </li>
                        </StaggerItem>
                    </ul>
                </StaggerContainer>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                    <Suspense
                        fallback={
                            <div className="text-2xl font-bold">
                                Loading price...
                            </div>
                        }
                    >
                        <DynamicPrice suitId={suitId} />
                    </Suspense>

                    {/* ✅ دکمه‌های اقدام بر اساس وضعیت لاگین */}
                    <ActionButtons
                        suitId={suitId}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
}

// ========== بخش گارانتی و خدمات ==========
function WarrantySection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-10 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center p-4">
                <FaTruck className="h-10 w-10 mx-auto text-amber-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    On orders over $200 worldwide
                </p>
            </div>

            <div className="text-center p-4">
                <FaShieldAlt className="h-10 w-10 mx-auto text-amber-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">
                    Quality Guarantee
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    365-day warranty on all suits
                </p>
            </div>

            <div className="text-center p-4">
                <FaExchangeAlt className="h-10 w-10 mx-auto text-amber-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    30-day return policy, no questions asked
                </p>
            </div>
        </div>
    );
}

// ========== صفحه اصلی جزئیات محصول ==========
export default async function SuitDetailPage({ params }) {
    // دریافت id از پارامترها
    const { suitid } = await params;
    const suitId = parseInt(suitid);

    // دریافت اطلاعات کاربر از سشن (اجرا در سرور)
    const user = await getCurrentUser();

    // بررسی معتبر بودن ID
    if (isNaN(suitId)) {
        return (
            <div className="text-center py-20 max-w-7xl mx-auto px-6">
                <h1 className="text-4xl tracking-wider uppercase flex flex-col items-center justify-center text-red-500">
                    <IoWarning className="h-16 w-16 error mb-4" />
                    Product not found!
                </h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    The product ID is not valid.
                </p>
                <Link
                    href="/collection"
                    className="backButton inline-block mt-6"
                >
                    Back to Collection
                </Link>
            </div>
        );
    }

    const suit = await getSuit(suitId);

    if (!suit) {
        return (
            <div className="text-center py-20 max-w-7xl mx-auto px-6">
                <h1 className="text-4xl tracking-wider uppercase flex flex-col items-center justify-center text-red-500">
                    <IoWarning className="h-16 w-16 error mb-4" />
                    Product not found!
                </h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    The product with ID{" "}
                    <span className="font-semibold italic px-2 text-2xl">
                        {suitId}
                    </span>{" "}
                    does not exist in our Collection.
                </p>
                <Link
                    href="/collection"
                    className="backButton inline-block mt-6"
                >
                    Browse Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <StaticSuitInfo
                suit={suit}
                suitId={suitId}
                user={user} // ✅ پاس دادن اطلاعات کاربر
            />
            <WarrantySection />
            <Footer />
        </div>
    );
}
