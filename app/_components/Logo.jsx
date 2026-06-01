import Image from "next/image";
import logo_light_theme from "@/public/logos/alireza2.png";
import logo_dark_theme from "@/public/logos/alireza4.png";
import Link from "next/link";

function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-4 z-10"
        >
            <Image
                src={logo_light_theme}
                quality={100}
                placeholder="blur"
                className="w-50 md:w-40 block dark:hidden"
                alt="The Wild Oasis logo"
            />
            <Image
                src={logo_dark_theme}
                quality={100}
                placeholder="blur"
                className="w-50 md:w-40 hidden dark:block"
                alt="The Wild Oasis logo"
            />
        </Link>
    );
}

export default Logo;
