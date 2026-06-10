"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const images = [
    "https://fuywdytjshcmnajjiieu.supabase.co/storage/v1/object/public/gallery/photo_5857340488799686031_y.jpg",
    "https://fuywdytjshcmnajjiieu.supabase.co/storage/v1/object/public/gallery/photo_5857340488799686030_y.jpg",
    "https://fuywdytjshcmnajjiieu.supabase.co/storage/v1/object/public/gallery/photo_5857340488799686032_y.jpg",
];

// برای افکت بینهایت، تصاویر را تکرار می‌کنیم
const duplicatedImages = [...images, ...images, ...images];

export default function InfiniteGallery() {
    const scrollRef = useRef(null);

    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        let animationId;
        let scrollPosition = 0;
        const speed = 0.8; // سرعت حرکت - می‌توانی تغییر دهی

        const animate = () => {
            scrollPosition += speed;
            // وقتی به انتهای دوبلیکیت رسیدیم، ریست می‌کنیم برای افکت بینهایت
            if (scrollPosition >= element.scrollWidth / 3) {
                scrollPosition = 0;
            }
            element.scrollLeft = scrollPosition;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="relative w-full overflow-hidden rounded-2xl">
            {/* سایه‌های محو در لبه‌ها */}
            <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

            {/* گالری اسکرول‌شونده */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    whiteSpace: "nowrap",
                }}
            >
                {duplicatedImages.map((src, index) => (
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-72 h-96 md:w-80 md:h-[26rem] rounded-xl overflow-hidden shadow-lg"
                    >
                        <Image
                            src={src}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 18rem, 20rem"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
