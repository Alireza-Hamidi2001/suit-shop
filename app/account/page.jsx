// app/account/page.js
import { auth, getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PiHandWaving } from "react-icons/pi";
import Image from "next/image";
import DeleteMenu from "../_components/DeleteMenu";
import UserDashboard from "../_components/UserDashboard";
import AdminDashboard from "../_components/AdminDashboard";

export const metadata = {
    title: "Account",
};

export default async function AccountPage() {
    // ✅ تشخیص روش لاگین
    const nextAuthSession = await auth();
    const customUser = await getCurrentUser();

    const isNextAuthUser = !!nextAuthSession?.user;
    const user = isNextAuthUser ? nextAuthSession.user : customUser;

    if (!user) {
        redirect("/login");
    }

    const avatar = isNextAuthUser ? user.image : user.avatar || "/user.png";

    return (
        <div className="">
            <header className="flex justify-between items-center mb-7">
                <h2 className="flex gap-1.5 justify-start items-center font-semibold text-3xl text-cyan-950 uppercase tracking-wider dark:text-cyan-50 ">
                    <p className="font-comic flex items-center font-light text-xl tracking-wide lowercase">
                        <span className="opacity-30 relative">
                            <PiHandWaving className="w-12 h-12 shakeHand" />
                        </span>
                        Welcome,{" "}
                    </p>
                    {user.name}
                </h2>
                <div className="flex items-center gap-4">
                    <DeleteMenu />
                </div>
            </header>

            <div className="mt-8 p-6 bg-white dark:bg-zinc-900 shadow rounded-lg">
                <div className="flex items-center gap-6">
                    {avatar && (
                        <div className="relative w-30 h-30 flex items-center">
                            <Image
                                src={avatar}
                                alt={user.name}
                                fill
                                className="object-top rounded-full"
                            />
                        </div>
                    )}
                    <div className="paragraph m-0 grid gap-2 pl-6 border-l border-zinc-200 dark:border-zinc-800">
                        <p className="text-lg flex gap-2 items-center">
                            <p className="font-semibold italic font-comic tracking-widest text-sm">
                                &bull; Email :
                            </p>{" "}
                            <p className="paragraph mb-0">{user.email}</p>
                        </p>
                        <p className="text-lg flex gap-2 items-center">
                            <p className="font-semibold italic font-comic tracking-widest text-sm">
                                &bull; Role :
                            </p>{" "}
                            <p className="py-1 px-2 bg-teal-500 dark:bg-teal-800 dark:text-white capitalize rounded-sm paragraph mb-0">
                                {user.role || "user"}
                            </p>
                        </p>
                    </div>
                </div>
            </div>

            {/* ✅ بخش متفاوت برای ادمین و کاربر معمولی */}
            <div className="mt-10">
                {user.role === "admin" ? (
                    <AdminDashboard />
                ) : (
                    <UserDashboard user={user} />
                )}
            </div>
        </div>
    );
}
