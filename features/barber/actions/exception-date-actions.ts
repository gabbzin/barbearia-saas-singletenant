"use server";

import { z } from "zod";
import { exceptionDateFormSchema } from "@/features/barber/schema/exception-date-schema";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const barberIdSchema = z.object({ barberId: z.string() });
const exceptionDateIdSchema = z.object({ exceptionDateId: z.string() });

const exceptionDateSchema = exceptionDateFormSchema.safeExtend({
  barberId: z.string(),
});

const patchExceptionDateSchema = exceptionDateFormSchema.safeExtend({
  exceptionDateId: z.string(),
});

function getTimeAsDate(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, hour, minute, 0, 0));
}

function getTimeOrNull(value: string | undefined, isClosedFullTime: boolean) {
  if (isClosedFullTime || !value) {
    return null;
  }

  return getTimeAsDate(value);
}

function getDateAtStartOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export const getExceptionDatesByBarberIdAction = actionClient
  .inputSchema(barberIdSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    const session = await verifySession();

    if (
      !session ||
      session.role !== "BARBER" ||
      session.barberId !== barberId
    ) {
      throw new Error("Não autorizado.");
    }

    const exceptionDates = await prisma.exceptionDate.findMany({
      where: { barberId },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return { exceptionDates };
  });

export const createExceptionDateAction = actionClient
  .inputSchema(exceptionDateSchema)
  .action(async ({ parsedInput }) => {
    const session = await verifySession();

    if (
      !session ||
      session.role !== "BARBER" ||
      session.barberId !== parsedInput.barberId
    ) {
      throw new Error("Não autorizado.");
    }

    const exceptionDate = await prisma.exceptionDate.create({
      data: {
        barberId: parsedInput.barberId,
        date: getDateAtStartOfDay(parsedInput.date),
        startTime: getTimeOrNull(
          parsedInput.startTime,
          parsedInput.isClosedFullTime,
        ),
        endTime: getTimeOrNull(
          parsedInput.endTime,
          parsedInput.isClosedFullTime,
        ),
        isClosedFullTime: parsedInput.isClosedFullTime,
      },
    });

    return { exceptionDate };
  });

export const patchExceptionDateAction = actionClient
  .inputSchema(patchExceptionDateSchema)
  .action(async ({ parsedInput }) => {
    const session = await verifySession();

    if (!session || session.role !== "BARBER" || !session.barberId) {
      throw new Error("Não autorizado.");
    }

    const existingExceptionDate = await prisma.exceptionDate.findUnique({
      where: { id: parsedInput.exceptionDateId },
      select: { barberId: true },
    });

    if (
      !existingExceptionDate ||
      existingExceptionDate.barberId !== session.barberId
    ) {
      throw new Error("Não autorizado.");
    }

    const exceptionDate = await prisma.exceptionDate.update({
      where: { id: parsedInput.exceptionDateId },
      data: {
        date: getDateAtStartOfDay(parsedInput.date),
        startTime: getTimeOrNull(
          parsedInput.startTime,
          parsedInput.isClosedFullTime,
        ),
        endTime: getTimeOrNull(
          parsedInput.endTime,
          parsedInput.isClosedFullTime,
        ),
        isClosedFullTime: parsedInput.isClosedFullTime,
      },
    });

    return { exceptionDate };
  });

export const deleteExceptionDateAction = actionClient
  .inputSchema(exceptionDateIdSchema)
  .action(async ({ parsedInput: { exceptionDateId } }) => {
    const session = await verifySession();

    if (!session || session.role !== "BARBER" || !session.barberId) {
      throw new Error("Não autorizado.");
    }

    const existingExceptionDate = await prisma.exceptionDate.findUnique({
      where: { id: exceptionDateId },
      select: { barberId: true },
    });

    if (
      !existingExceptionDate ||
      existingExceptionDate.barberId !== session.barberId
    ) {
      throw new Error("Não autorizado.");
    }

    await prisma.exceptionDate.delete({ where: { id: exceptionDateId } });

    return { exceptionDateId };
  });
