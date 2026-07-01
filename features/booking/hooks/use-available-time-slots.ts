/** biome-ignore-all lint/style/noNonNullAssertion: <Sempre terá valor> */
"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { getDateAvailableTimeSlots } from "@/features/booking/functions/get-date-available-time-slots";

export function useAvailableTimeSlots(
  barberId?: string,
  servicesIds?: string[],
  selectedDate?: Date,
  bookingBufferBool = true,
) {
  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const servicesKey = servicesIds?.slice().sort().join(",") ?? "";

  const { data: availableTimeSlots, isPending: isAvailableTimePending, fetchStatus } =
    useQuery<string[]>({
      queryKey: [
        "date-available-time-slots",
        barberId,
        servicesKey,
        selectedDateKey,
      ],
      queryFn: async () => {
        const result = await getDateAvailableTimeSlots({
          barberId: barberId!,
          servicesIds: servicesIds!,
          bookingBufferBool,
          date: selectedDate!,
        });

        if (result.validationErrors || result.serverError) {
          toast.error(
            `Erro ao buscar horários disponíveis: ${
              result.validationErrors?._errors?.[0] || result.serverError
            }`,
          );
          return [];
        }

        return result?.data || [];
      },
      enabled: !!selectedDate && !!barberId && (servicesIds?.length ?? 0) > 0,
    });

  return { availableTimeSlots, isAvailableTimePending: isAvailableTimePending && fetchStatus !== "idle" };
}
