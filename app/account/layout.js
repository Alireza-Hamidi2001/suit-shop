// app/account/layout.js
import { auth, getCurrentUser } from "@/lib/auth";
import SideNavigation from "../_components/SideNavigation";
import { redirect } from "next/navigation";
import Footer from "../_components/Footer";

async function Layout({ children }) {
    const nextAuthSession = await auth();
    const customUser = await getCurrentUser();

    const isNextAuthUser = !!nextAuthSession?.user;
    const user = isNextAuthUser ? nextAuthSession.user : customUser;

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            <div className="h-[92vh] text-cyan-950 dark:text-cyan-100 grid grid-cols-[16rem_1fr] mb-24 max-h-full gap-12">
                <div>
                    <SideNavigation
                        user={user}
                        isNextAuthUser={isNextAuthUser}
                    />
                </div>
                <div className="py-1 overflow-auto">{children}</div>
            </div>
            <Footer />
        </>
    );
}

export default Layout;
