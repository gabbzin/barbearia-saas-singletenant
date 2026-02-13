import { redirect } from "next/navigation";
import { getBookingsUser } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import BookingsClient from "./_components/bookingsClient";

const BookingsPage = async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/");
  }

  const bookings = await getBookingsUser(session.id);

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between">
      <div>
        <Header />
        <BookingsClient bookings={bookings} />
      </div>
      <Footer />
    </div>
  );
};

export default BookingsPage;
