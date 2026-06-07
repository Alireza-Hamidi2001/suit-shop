// components/UserDashboard.jsx
import Link from "next/link";
import { FaShoppingBag, FaUserEdit, FaHistory } from "react-icons/fa";
import ScrollReveal from "./ScrollReveal";

function UserDashboard({ user }) {
    return (
        <div>
            <div className="inline-block mb-8">
                <span className="subHeading">&bull; dashboard</span>
                <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScrollReveal
                    direction="left"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
                >
                    <Link href="/account/profile">
                        <FaUserEdit className="w-12 h-12 mx-auto text-amber-600 mb-3" />
                        <h4 className="paragraph mb-0 font-semibold text-lg">
                            Edit Profile
                        </h4>
                        <p className="text-sm text-gray-500 mt-2">
                            Update your personal information
                        </p>
                    </Link>
                </ScrollReveal>

                <ScrollReveal
                    direction="left"
                    delay={0.1}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
                >
                    <Link href="/account/orders">
                        <FaHistory className="w-12 h-12 mx-auto text-amber-600 mb-3" />
                        <h4 className="paragraph mb-0 font-semibold text-lg">
                            Order History
                        </h4>
                        <p className="text-sm text-gray-500 mt-2">
                            View your last orders
                        </p>
                    </Link>
                </ScrollReveal>

                <ScrollReveal
                    direction="left"
                    delay={0.2}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
                >
                    <Link href="/collection">
                        <FaShoppingBag className="w-12 h-12 mx-auto text-amber-600 mb-3" />
                        <h4 className="paragraph mb-0 font-semibold text-lg">
                            Continue Shopping
                        </h4>
                        <p className="text-sm text-gray-500 mt-2">
                            Browse our latest collection
                        </p>
                    </Link>
                </ScrollReveal>
            </div>
        </div>
    );
}

export default UserDashboard;
