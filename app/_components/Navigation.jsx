// app/_components/Navigation.jsx
import NavLinks from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { auth, getCurrentUser } from "@/lib/auth";

export default async function Navigation() {
    const user = await getCurrentUser();
    const session = await auth();
    console.log(session);

    return (
        <nav className="z-10 text-md flex gap-16 items-center">
            <NavLinks
                session={session}
                user={user}
            />
            <ThemeToggle />
        </nav>
    );
}
