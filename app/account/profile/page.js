// app/account/profile/page.js
import ProfileForm from "@/app/_components/ProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Update profile",
};

export default async function Page() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    console.log("User in profile page:", user);

    return <ProfileForm user={user} />;
}
