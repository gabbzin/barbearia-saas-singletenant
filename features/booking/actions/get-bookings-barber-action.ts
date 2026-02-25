"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { getBookingsBarber } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";

const inputSchema = z.object({ barberId: z.string() });

export const getBookingsBarberAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado."],
      });
    }

    const bookings = await getBookingsBarber(barberId);
    return { bookings };
  });
