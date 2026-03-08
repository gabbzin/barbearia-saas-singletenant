"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { getBookingsBarber } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";

const inputSchema = z.object({
  date: z.string().optional(),
});

/**
 * Ação para obter os agendamentos de um barbeiro, com opção de filtrar por data.
 * Com a data for fornecida, retorna os agendamentos para aquele dia específico.
 */
export const getBookingsBarberAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { date } }) => {
    const session = await verifySession();

    if (!session || session.role !== "BARBER" || !session.barberId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autorizado."],
      });
    }

    const barberId = session.barberId;

    const targetDate = date
      ? (() => {
          const [year, month, day] = date.split("-").map(Number);
          return new Date(year, month - 1, day);
        })()
      : undefined;

    const bookings = await getBookingsBarber(barberId, targetDate);

    return { bookings };
  });
