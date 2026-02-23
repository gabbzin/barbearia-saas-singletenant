"use server";

import { revalidatePath } from "next/cache";
import { returnValidationErrors } from "next-safe-action";
import { object, string } from "zod";
import { confirmBooking } from "@/features/booking/functions/confirm-booking";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";

const inputSchema = object({
  bookingId: string(),
});

export const confirmBookingAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }: { parsedInput: { bookingId: string } }) => {
    const bookingId = parsedInput.bookingId;
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado."],
      });
    }

    if (!session.barberId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autorizado."],
      });
    }

    await confirmBooking(bookingId);

    revalidatePath("/barber/schedule");
    return { success: true };
  });
