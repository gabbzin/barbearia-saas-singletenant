"use server";

import { z } from "zod";
import { timesSchema } from "@/features/booking/schema/timesSchema";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const barberIdSchema = z.object({ barberId: z.string() });

export const getSettingsByBarberIdAction = actionClient
  .inputSchema(barberIdSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    const disponibilities = await prisma.disponibility.findMany({
      where: { barberId },
    });

    if (!disponibilities || disponibilities.length === 0) {
      return { settings: null };
    }

    return {
      settings: {
        barberId,
        daysOfWeek: disponibilities.map(d => d.dayOfWeek),
        startTime: disponibilities[0].startTime,
        endTime: disponibilities[0].endTime,
      },
    };
  });

export const createDisponibilityAction = actionClient
  .inputSchema(timesSchema.safeExtend({ barberId: z.string() }))
  .action(async ({ parsedInput }) => {
    const { barberId, horario_abertura, horario_fechamento, ...days } =
      parsedInput;
    const selectedDates = Object.entries(days)
      .filter(([, val]) => val === true)
      .map(([key]) => Number(key));

    await prisma.$transaction(async tx => {
      await tx.disponibility.deleteMany({ where: { barberId } });
      if (selectedDates.length > 0) {
        await tx.disponibility.createMany({
          data: selectedDates.map(day => ({
            barberId,
            dayOfWeek: day,
            startTime: horario_abertura,
            endTime: horario_fechamento,
          })),
        });
      }
    });

    return {
      settings: {
        daysOfWeek: selectedDates,
        startTime: horario_abertura,
        endTime: horario_fechamento,
        barberId,
      },
    };
  });
