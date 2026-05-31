import Link from "next/link";

function LoginMessage() {
    return (
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4 mt-6">
            <Link
                href="/login"
                className="paragraph m-0 hover:cursor-pointer"
            >
                &bull; Please Login first
            </Link>
            <Link
                href="/collection"
                className="backButton"
            >
                Back to Collection
            </Link>
        </div>
    );
}

export default LoginMessage;
