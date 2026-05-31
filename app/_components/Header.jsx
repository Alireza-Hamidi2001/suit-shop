import Logo from "./Logo";
import Navigation from "./Navigation";

function Header() {
    return (
        <header className="border-b border-zinc-200 dark:border-zinc-800 px-8 py-3">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Logo />
                <Navigation />
            </div>
        </header>
    );
}

export default Header;
