"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { getDateAvailableTimeSlots } from "@/features/booking/functions/get-date-available-time-slots";

export function useAvailableTimeSlots(
  barberId: string,
  serviceId: string,
  selectedDate?: Date,
  bookingBufferBool = true,
) {
  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const { data: availableTimeSlots, isPending: isAvailableTimePending } =
    useQuery<string[]>({
      queryKey: [
        "date-available-time-slots",
        barberId,
        serviceId,
        selectedDateKey,
      ],
      queryFn: async () => {
        const result = await getDateAvailableTimeSlots({
          barberId,
          serviceId,
          bookingBufferBool,
          // biome-ignore lint/style/noNonNullAssertion: <Sempre vai ter valor aqui>
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
      enabled: !!selectedDate && !!serviceId,
    });

  return { availableTimeSlots, isAvailableTimePending };
}
