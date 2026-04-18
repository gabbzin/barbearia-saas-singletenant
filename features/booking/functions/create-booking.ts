"use server";

import { returnValidationErrors } from "next-safe-action";
import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  barberId: z.uuid(),
  servicesIds: z.array(z.uuid()).min(1),
  date: z.date(),
  paymentMethod: z.string(),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(
    async ({ parsedInput: { barberId, servicesIds, date, paymentMethod } }) => {
      const user = await verifySession();
      const uniqueServicesIds = [...new Set(servicesIds)];

      if (!user) {
        return returnValidationErrors(inputSchema, {
          _errors: [
            "Você não tem autorização para realizar agendamentos. Faça login.",
          ],
        });
      }

      // Validação: não permitir agendamentos no passado
      if (date < new Date()) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Não é possível agendar em uma data passada."],
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
          barberId,
        },
        select: {
          id: true,
          priceInCents: true,
          durationInMinutes: true,
        },
      });

      if (!services || services.length !== uniqueServicesIds.length) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Um ou mais serviços não foram encontrados para este barbeiro."],
        });
      }

      const totalPriceInCents = services.reduce(
        (sum, service) => sum + service.priceInCents,
        0,
      );

      const totalDurationInMinutes = services.reduce(
        (sum, service) => sum + service.durationInMinutes,
        0,
      );

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
          userId: user.id,
          services: {
            connect: uniqueServicesIds.map(id => ({ id })),
          },
          date,
          paymentMethod,
          priceInCents: totalPriceInCents,
        },
      });

      return booking;
    },
  );
