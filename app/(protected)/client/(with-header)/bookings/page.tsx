import { getBookingsUserIdAction } from "@/features/booking/actions/get-bookings-user-action";
import BookingsClient from "@/features/booking/components/booking-client";

const BookingsPage = async () => {
  const bookings = await getBookingsUserIdAction();

  return <BookingsClient bookings={bookings.data ?? null} />;
};

export default BookingsPage;
