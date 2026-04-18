"use server";

import { revalidatePath } from "next/cache";
import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { GHOST_USER_ID } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { barberRoutes } from "@/shared/constants/routes";

const inputSchema = z.object({
  servicesIds: z.array(z.uuid()).min(1),
  date: z.date(),
  name: z.string(),
  phone: z.string(),
  paymentMethod: z.string(),
});

export const createBookingWithoutSession = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { servicesIds, date, name, phone, paymentMethod } = parsedInput;
    const uniqueServicesIds = [...new Set(servicesIds)];

    const session = await verifySession();

    if (session?.role !== "BARBER") {
      return returnValidationErrors(inputSchema, {
        _errors: ["Apenas barbeiros podem criar agendamentos sem sessão."],
      });
    }

    if (!session.barberId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Barbeiro não vinculado à sessão."],
      });
    }

    if (uniqueServicesIds.length !== servicesIds.length) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não é permitido selecionar o mesmo serviço mais de uma vez."],
      });
    }

    const services = await prisma.barberService.findMany({
      where: {
        id: { in: uniqueServicesIds },
      },
      select: {
        id: true,
        barberId: true,
        priceInCents: true,
        durationInMinutes: true,
      },
    });

    if (services.length !== uniqueServicesIds.length) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Um ou mais serviços não foram encontrados."],
      });
    }

    const hasDifferentBarber = services.some(
      service => service.barberId !== session.barberId,
    );

    if (hasDifferentBarber) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Os serviços selecionados não pertencem ao barbeiro logado."],
      });
    }

    const barberId = session.barberId;
    const userId = `${GHOST_USER_ID}`;
    const totalPriceInCents = services.reduce(
      (sum, service) => sum + service.priceInCents,
      0,
    );

    const totalDurationInMinutes = services.reduce(
      (sum, service) => sum + service.durationInMinutes,
      0,
    );

    if (date < new Date()) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não é possível agendar em uma data passada."],
      });
    }

    const proposedStart = date;
    const proposedEnd = addMinutes(date, totalDurationInMinutes);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const existingBookings = await prisma.booking.findMany({
      where: {
        status: "SCHEDULED",
        barberId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        date: true,
        services: {
          select: {
            durationInMinutes: true,
          },
        },
      },
    });

    const hasConflict = existingBookings.some(existingBooking => {
      const existingStart = existingBooking.date;
      const existingDurationInMinutes = existingBooking.services.reduce(
        (sum, service) => sum + service.durationInMinutes,
        0,
      );
      const existingEnd = addMinutes(existingStart, existingDurationInMinutes);

      return proposedStart < existingEnd && proposedEnd > existingStart;
    });

    if (hasConflict) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Já existe um agendamento nesse intervalo de horário."],
      });
    }

    const booking = await prisma.booking.create({
      data: {
        barberId,
        customerName: name,
        customerPhone: phone,
        date,
        paymentMethod,
        priceInCents: totalPriceInCents,
        services: {
          connect: uniqueServicesIds.map(id => ({ id })),
        },
        userId,
      },
    });

    revalidatePath(barberRoutes.dashboard);
    return { success: true, bookingId: booking.id };
  });
