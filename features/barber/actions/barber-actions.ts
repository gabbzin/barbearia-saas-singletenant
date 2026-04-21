"use server";

import { z } from "zod";
import { timesSchema } from "@/features/booking/schema/timesSchema";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { timeDateToString, timeStringToDate } from "@/utils/convertTimes";

const barberIdSchema = z.object({ barberId: z.string() });

export const getSettingsByBarberIdAction = actionClient
  .inputSchema(barberIdSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    const disponibilities = await prisma.disponibility.findMany({
      where: { barberId },
      orderBy: { dayOfWeek: "asc" },
    });

    if (!disponibilities || disponibilities.length === 0) {
      return { settings: null };
    }

    return {
      settings: {
        barberId,
        availabilities: disponibilities.map(d => ({
          day: d.dayOfWeek,
          startTime: timeDateToString(d.startTime),
          endTime: timeDateToString(d.endTime),
        })),
      },
    };
  });

export const createDisponibilityAction = actionClient
  .inputSchema(timesSchema.safeExtend({ barberId: z.string() }))
  .action(async ({ parsedInput }) => {
    const { barberId, day, horario_abertura, horario_fechamento } = parsedInput;

    await prisma.disponibility.upsert({
      where: {
        barberId_dayOfWeek: {
          barberId,
          dayOfWeek: day,
        },
      },
      update: {
        startTime: timeStringToDate(horario_abertura),
        endTime: timeStringToDate(horario_fechamento),
      },
      create: {
        barberId,
        dayOfWeek: day,
        startTime: timeStringToDate(horario_abertura),
        endTime: timeStringToDate(horario_fechamento),
      },
    });

    return { success: true };
  });
