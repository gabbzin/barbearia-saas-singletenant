"use client";

import { useAction } from "next-safe-action/hooks";
import { getBookingsBarberAction } from "@/features/booking/actions/get-bookings-barber-action";
import { useSafeQuery } from "@/hooks/use-safe-query";
import type { getBookingsBarber } from "../functions/get-bookings";

export function useBookings() {
  const { executeAsync } = useAction(getBookingsBarberAction);
  const { data, isLoading, isError } = useSafeQuery<{
    bookings: Awaited<ReturnType<typeof getBookingsBarber>>;
  }>(["bookings"], () => executeAsync());

  return { data: data?.bookings ?? null, isLoading, isError };
}
