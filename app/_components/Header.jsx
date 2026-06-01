import Logo from "./Logo";
import Navigation from "./Navigation";

function Header() {
    return (
        <header className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="h-[8vh] sm:h-[10vh] flex justify-between items-center px-3 py-1 md:px-6 md:py-2 lg:px-8 lg:py-3">
                <Logo />
                <Navigation />
            </div>
        </header>
    );
}

export default Header;
