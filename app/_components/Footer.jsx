import Image from "next/image";
import Link from "next/link";

import { FaTelegram, FaInstagram, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";

function Footer() {
    return (
        <footer className="relative bg-amber-50 dark:bg-zinc-950 pt-8 mt-16">
            <div className="max-w-7xl grid gap-4 mx-auto px-6">
                <span className="bubbleAnimation1  w-16 h-16 absolute rounded-full bg-amber-500/15 dark:bg-zinc-900/40 left-[40%] -translate-x-1/2 top-[4rem] animate-bounce-slow"></span>{" "}
                <span className="bubbleAnimation2  w-12 h-12 absolute rounded-full bg-amber-500/15 dark:bg-zinc-900/40 left-[20%] -translate-x-1/2 bottom-0 animate-bounce-slow"></span>{" "}
                <span className="bubbleAnimation3  w-6 h-6 absolute rounded-full bg-amber-500/15 dark:bg-zinc-900/40 left-[70%] -translate-x-2/3 bottom-0 animate-bounce-slow"></span>{" "}
                <div className="mx-auto mb-4">
                    <Logo />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <p className="paragraph">
                            Premium suits for women and men. Timeless elegance,
                            modern tailoring.
                        </p>
                    </div>
                    <div>
                        <h3 className="subHeading mb-4">&mdash; Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="navigation"
                                >
                                    &bull; Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/suits"
                                    className="navigation"
                                >
                                    &bull; Collection
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="navigation"
                                >
                                    &bull; About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="subHeading mb-4">&mdash; Follow Us</h3>
                        <ul className="flex gap-4">
                            <li>
                                <Link
                                    href=""
                                    target="_blank"
                                >
                                    <FaTelegram className="w-10 h-10 hover:-translate-y-0.5 duration-200 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    target="_blank"
                                >
                                    <FaInstagram className="w-10 h-10 hover:-translate-y-0.5 duration-200 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    target="_blank"
                                >
                                    <FaLinkedin className="w-10 h-10 hover:-translate-y-0.5 duration-200 transition-all" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="dark:border-gray-800 text-center">
                    <p className="paragraph copyright text-2xl">
                        &copy;  Suitelier. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
