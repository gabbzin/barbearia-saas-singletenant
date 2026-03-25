"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/features/user/repository/user.repository";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

const inputSchema = z.object({
  bookingId: z.uuid(),
});

export const cancelBookingAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const user = await verifySession();

    if (!user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Booking not found"],
      });
    }
    // Serve tanto para o cliente quanto para o barbeiro, já que ambos podem cancelar um agendamento
    if (booking.userId !== user.id || booking.barberId !== user.barberId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/barber/schedule");
    return { success: true };
  });
