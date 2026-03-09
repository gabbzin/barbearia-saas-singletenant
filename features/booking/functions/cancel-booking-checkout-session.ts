"use server";

import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

const inputSchema = z.object({
  bookingId: z.uuid(),
});

export const cancelBookingCheckoutSession = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking || booking.stripeChargeId === null) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Booking not found"],
      });
    }

    if (booking.userId !== session.user.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    try {
      await stripeClient.refunds.create({
        charge: booking.stripeChargeId,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao processar reembolso";
      return returnValidationErrors(inputSchema, {
        _errors: [message],
      });
    }

    return { success: true };
  });
