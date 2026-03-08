"use server";

import { revalidatePath } from "next/cache";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { GHOST_USER_ID } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { barberRoutes } from "@/shared/constants/routes";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
  name: z.string(),
  phone: z.string(),
  paymentMethod: z.string(),
});

export const createBookingWithoutSession = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { serviceId, date, name, phone, paymentMethod } = parsedInput;

    const session = await verifySession();

    if (session?.role !== "BARBER") {
      return returnValidationErrors(inputSchema, {
        _errors: ["Apenas barbeiros podem criar agendamentos sem sessão."],
      });
    }

    const service = await prisma.barberService.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Serviço não encontrado."],
      });
    }
    const barberId = session?.barberId || service.barberId;
    const userId = `${GHOST_USER_ID}`;

    const booking = await prisma.booking.create({
      data: {
        barberId,
        customerName: name,
        customerPhone: phone,
        date,
        paymentMethod,
        priceInCents: service.priceInCents,
        serviceId: serviceId,
        userId,
      },
    });

    revalidatePath(barberRoutes.dashboard);
    return { success: true, bookingId: booking.id };
  });
