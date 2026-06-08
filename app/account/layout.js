// app/account/layout.js
import { auth, getCurrentUser } from "@/lib/auth";
import SideNavigation from "../_components/SideNavigation";
import { redirect } from "next/navigation";
import Footer from "../_components/Footer";
import { getPendingCommentsCount } from "@/lib/data-service";

async function Layout({ children }) {
    const nextAuthSession = await auth();
    const customUser = await getCurrentUser();

    const isNextAuthUser = !!nextAuthSession?.user;
    const user = isNextAuthUser ? nextAuthSession.user : customUser;

    if (!user) {
        redirect("/login");
    }

    // ✅ دریافت تعداد نظرات تایید نشده (فقط برای ادمین)
    let pendingCommentsCount = 0;
    if (user.role === "admin") {
        pendingCommentsCount = await getPendingCommentsCount();
    }

    return (
        <>
            <div className="text-cyan-950 dark:text-cyan-100 grid grid-cols-[auto_1fr] md:grid-cols-[16rem_1fr] mb-24 max-h-full gap-4 sm:gap-8 md:gap-12">
                <div>
                    <SideNavigation
                        user={user}
                        isNextAuthUser={isNextAuthUser}
                        pendingCommentsCount={pendingCommentsCount}
                    />
                </div>
                <div className="py-1">{children}</div>
            </div>
            <Footer />
        </>
    );
}

export default Layout;
