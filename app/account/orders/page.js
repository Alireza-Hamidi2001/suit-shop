// app/account/orders/page.js
import { auth, getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/data-service";
import OrdersList from "@/app/_components/OrdersList";

export const metadata = {
    title: "My Orders",
};

export default async function OrdersPage() {
    const session = await auth();
    const customUser = await getCurrentUser();

    const isNextAuthUser = !!session?.user;
    const user = isNextAuthUser ? session.user : customUser;

    if (!user) {
        redirect("/login");
    }

    // فقط کاربر معمولی اجازه دسترسی دارد
    if (user.role !== "user") {
        redirect("/account");
    }

    const orders = await getOrdersByUser(user.id);

    return (
        <div className="min-h-[60vh]">
            <div className="inline-block mb-8">
                <span className="subHeading">&bull; My Orders</span>
                <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-amber-50 dark:bg-zinc-900 rounded-lg">
                    <p className="text-gray-500 italic">
                        You haven&apos;t placed any orders yet.
                    </p>
                </div>
            ) : (
                <OrdersList orders={orders} />
            )}
        </div>
    );
}
