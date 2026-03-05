"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
  paymentMethod: z.string()
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date, paymentMethod } }) => {
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
    // verificar se já existe agendamento para essa data
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date,
        status: "SCHEDULED",
        serviceId,
      },
    });
    if (existingBooking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Já existe um agendamento para essa data."],
      });
    }

    const booking = await prisma.booking.create({
      data: {
        barberId: service.barberId,
        userId: user.id,
        serviceId: serviceId,
        date,
        paymentMethod,
        priceInCents: service.priceInCents,
      },
    });

    return booking;
  });
