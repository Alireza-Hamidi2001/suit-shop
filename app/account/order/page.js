import ReservationCard from "@/app/_components/ReservationCard";
import { GiClick } from "react-icons/gi";
import Link from "next/link";

export const metadata = {
    title: "Your orders",
};

export default function Page() {
    // CHANGE
    const bookings = [];

    return (
        <div>
            <h2 className="title">&bull; Your orders</h2>

            {bookings.length === 0 ? (
                <>
                    <p className="text-lg paragraph">
                        You haven&apos;t placed any orders yet. Explore our
                        <Link className="px-2 title text-3xl" href="/cabins">
                            collection
                        </Link>
                        and find the perfect suit for your next occasion.
                    </p>
                    <Link href="/collection">
                        <button className="button flex gap-2 items-center">
                            Our collection{" "}
                            <GiClick className="clickAnimation w-5 h-5" />
                        </button>
                    </Link>
                </>
            ) : (
                <ul className="space-y-6">
                    {bookings.map((booking) => (
                        <ReservationCard booking={booking} key={booking.id} />
                    ))}
                </ul>
            )}
        </div>
    );
}
