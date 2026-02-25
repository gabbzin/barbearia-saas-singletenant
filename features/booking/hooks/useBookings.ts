"use client";

import { useAction } from "next-safe-action/hooks";
import { getBookingsBarberAction } from "@/features/booking/actions/get-bookings-barber-action";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useBookings(barberId: string) {
  const { executeAsync } = useAction(getBookingsBarberAction);
  const { data, isLoading, isError } = useSafeQuery(
    ["bookings", barberId],
    () => executeAsync({ barberId }),
  );

  return { data: data?.bookings ?? null, isLoading, isError };
}
