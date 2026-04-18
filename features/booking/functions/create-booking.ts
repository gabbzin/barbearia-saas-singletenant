"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  barberId: z.uuid(),
  servicesIds: z.array(z.uuid()),
  date: z.date(),
  paymentMethod: z.string(),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(
    async ({ parsedInput: { barberId, servicesIds, date, paymentMethod } }) => {
      const user = await verifySession();

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

      const services = await prisma.barberService.findMany({
        where: {
          id: { in: servicesIds },
          barberId,
        },
      });

      if (!services || services.length === 0) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Serviço não encontrado."],
        });
      }

      // verificar se já existe agendamento para essa data
      const existingBooking = await prisma.booking.findFirst({
        where: {
          date,
          status: "SCHEDULED",
          barberId,
        },
      });

      if (existingBooking) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Já existe um agendamento para essa data."],
        });
      }

      const totalPriceInCents = services.reduce(
        (sum, service) => sum + service.priceInCents,
        0,
      );

      const booking = await prisma.booking.create({
        data: {
          barberId,
          userId: user.id,
          services: {
            connect: servicesIds.map(id => ({ id })),
          },
          date,
          paymentMethod,
          priceInCents: totalPriceInCents,
        },
      });

      return booking;
    },
  );
