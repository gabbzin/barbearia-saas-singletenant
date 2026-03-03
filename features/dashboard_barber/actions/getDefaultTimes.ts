"use server";

import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

export const getBarberDefaultTimes = actionClient.action(async () => {
  const session = await verifySession();

  if (!session || session.role !== "BARBER" || !session.barberId) {
    throw new Error("Unauthorized");
  }

  const barberId = session.barberId;
  const dayOfWeek = new Date().getDay();

  const horariosData = await prisma.disponibility.findUnique({
    where: {
      barberId_dayOfWeek: {
        barberId,
        dayOfWeek,
      },
    },
  });

  if (!horariosData) {
    return {
      horariosData: null,
      defaultTimes: null as TimesSchemaData | null,
    };
  }

  const defaultTimes: TimesSchemaData = {
    horario_abertura: horariosData.startTime,
    horario_fechamento: horariosData.endTime,
    0: horariosData.dayOfWeek === 0,
    1: horariosData.dayOfWeek === 1,
    2: horariosData.dayOfWeek === 2,
    3: horariosData.dayOfWeek === 3,
    4: horariosData.dayOfWeek === 4,
    5: horariosData.dayOfWeek === 5,
    6: horariosData.dayOfWeek === 6,
  };

  return { horariosData, defaultTimes };
});
