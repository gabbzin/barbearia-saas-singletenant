"use server";

import { returnValidationErrors } from "next-safe-action";
import { object, string } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const inputSchema = object({
  userId: string(),
});

export const getLastBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { userId } = parsedInput;
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado."],
      });
    }

    if (session.id !== userId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autorizado."],
      });
    }

    const lastBooking = await prisma.booking.findFirst({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (!lastBooking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Nenhuma reserva encontrada para este usuário."],
      });
    }

    return lastBooking;
  });
