import { FaRulerCombined, FaShoppingBag } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { kottaOne } from "../fonts";
import { StaggerContainer, StaggerItem } from "./StaggerWrapper";
import ScrollReveal from "./ScrollReveal";

function SuitCard({ suit }) {
    const { id, name, price, discount, image, fabric } = suit;
    const imageSrc = image || "/suit-placeholder.jpg";

    const numericPrice = Number(price);
    const numericDiscount = Number(discount) || 0;

    const discountedPrice =
        numericPrice - (numericPrice * numericDiscount) / 100;
    const hasDiscount = numericDiscount > 0;

    return (
        <div className="flex bg-amber-100 dark:bg-zinc-900 rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-2/4 h-auto min-h-50 overflow-hidden">
                <Image
                    fill
                    src={imageSrc}
                    alt={`Suit ${name}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-120 transition duration-500"
                />
                {hasDiscount && (
                    <div className="discount">-{numericDiscount} %</div>
                )}
            </div>

            <div className="border border-amber-200 dark:border-zinc-800 flex-1 flex flex-col bg-amber-100 dark:bg-zinc-900">
                <div className="pt-5 pb-4 px-3 flex-1">
                    <StaggerContainer>
                        <h3 className="title font-open-sans py-4 px-3 italic bg-amber-100 rounded-sm dark:bg-zinc-900 -translate-x-10 text-xl mb-3">
                            &bull; {name}
                        </h3>
                        <StaggerItem>
                            <div className="flex gap-1 items-center mb-2 text-paragraph-light dark:text-paragraph-dark">
                                <p className="text-sm italic">
                                    Fabric :{" "}
                                    <span className="font-bold">
                                        {fabric || "Premium Wool"}
                                    </span>
                                </p>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <p className="flex gap-3 items-baseline flex-wrap">
                                {hasDiscount ? (
                                    <>
                                        <span
                                            className={`${kottaOne.className} text-2xl font-[350] text-amber-600 dark:text-amber-400`}
                                        >
                                            ${discountedPrice.toFixed(2)}
                                        </span>
                                        <span className="line-through text-red-600 dark:text-red-400 text-sm">
                                            ${numericPrice.toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className={`${kottaOne.className} text-2xl font-[350] text-paragraph-light dark:text-paragraph-dark`}
                                    >
                                        ${numericPrice.toFixed(2)}
                                    </span>
                                )}
                                {/* <span className="text-paragraph-light dark:text-paragraph-dark text-sm italic">
                            / suit
                            </span> */}
                            </p>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
                <StaggerContainer>
                    <StaggerItem>
                        <div className="pb-4 flex justify-end mr-2">
                            <Link
                                href={`/collection/${id}`}
                                className="cardButton flex font-open-sans tracking-wider italic  items-center gap-2"
                            >
                                <FaShoppingBag className="h-3 w-3" />
                                View Details &rarr;
                            </Link>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </div>
        </div>
    );
}

export default SuitCard;
