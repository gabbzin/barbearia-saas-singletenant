import { redirect } from "next/navigation";
import { getBookingsUser } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import BookingsClient from "../../../../../features/booking/components/booking-client";

const BookingsPage = async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/");
  }

  const bookings = await getBookingsUser(session.id);

  return <BookingsClient bookings={bookings} />;
};

export default BookingsPage;
