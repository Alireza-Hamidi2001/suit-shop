// app/account/page.js
import { auth, getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PiHandWaving } from "react-icons/pi";
import Image from "next/image";
import DeleteMenu from "../_components/DeleteMenu";
import SignOutButton from "../_components/SignOutButton"; // ✅ اضافه کن

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

    // آواتار: اگه از NextAuth اومده باشه از user.image استفاده کن
    const avatar = isNextAuthUser ? user.image : user.avatar || "/user.png";

    return (
        <div>
            <header className="flex justify-between items-center mb-7">
                <h2 className="flex gap-1.5 justify-start items-center font-semibold text-3xl text-cyan-950 uppercase tracking-wider dark:text-cyan-50 ">
                    <p className="flex items-center font-light text-xl tracking-normal lowercase">
                        <span className="opacity-30 relative">
                            <PiHandWaving className="w-12 h-12 shakeHand" />
                        </span>
                        Welcome,{" "}
                    </p>
                    {user.name}
                </h2>
                <div className="flex items-center gap-4">
                    <DeleteMenu />
                    {/* <SignOutButton isNextAuthUser={isNextAuthUser} /> */}
                </div>
            </header>

            {/* نمایش اطلاعات کاربر */}
            <div className="mt-8 p-6 bg-amber-100 dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 rounded-lg">
                <div className="flex items-center gap-6">
                    {avatar && (
                        <div className="relative w-30 h-30">
                            <Image
                                src={avatar}
                                alt={user.name}
                                fill
                                className="object-cover object-top rounded-full border-2 border-accent-500"
                            />
                        </div>
                    )}
                    <div className="paragraph m-0">
                        <p className="text-lg">
                            <span className="font-semibold italic font-comic tracking-widest text-sm">
                                &bull; Email :
                            </span>{" "}
                            {user.email}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold italic font-comic tracking-widest text-sm">
                                &bull; Role :
                            </span>{" "}
                            {user.role || "user"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
