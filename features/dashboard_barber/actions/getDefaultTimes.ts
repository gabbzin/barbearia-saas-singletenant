"use server";

import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { formatInTimeZone } from "date-fns-tz";
import { timeDateToString } from "@/utils/convertTimes";

export const getBarberDefaultTimes = actionClient.action(async () => {
  const session = await verifySession();

  if (!session || session.role !== "BARBER" || !session.barberId) {
    throw new Error("Unauthorized");
  }

  const barberId = session.barberId;

  const horariosData = await prisma.disponibility.findMany({
    where: {
      barberId,
    },
  });

  const today = new Date();
  const todayDay = new Date(
    formatInTimeZone(today, DEFAULT_TIMEZONE, "yyyy-MM-dd"),
  ).getDay();

  const todayDisponibility = horariosData.find(
    disponibility => disponibility.dayOfWeek === todayDay,
  );

  if (!horariosData) {
    return {
      horariosData: null,
      defaultTimes: [],
    };
  }

  const defaultTimes: TimesSchemaData[] = horariosData.map(disponibility => ({
    day: disponibility.dayOfWeek,
    horario_abertura: timeDateToString(disponibility.startTime),
    horario_fechamento: timeDateToString(disponibility.endTime),
  }));

  return { horariosData: todayDisponibility, defaultTimes };
});
