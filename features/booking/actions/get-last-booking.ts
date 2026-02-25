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
  .action(async ({ parsedInput }: { parsedInput: { userId: string } }) => {
    const userId = parsedInput.userId;
    const session = await verifySession();

    if (!session) {
      returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado."],
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
      returnValidationErrors(inputSchema, {
        _errors: ["Nenhuma reserva encontrada para este usuário."],
      });
    }

    return lastBooking;
  });
