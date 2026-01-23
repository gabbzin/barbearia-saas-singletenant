"use server";

import { endOfDay, format, startOfDay } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
// import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
// import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  barberId: z.string(),
  date: z.date(),
});

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Função para converter minutos de volta para "HH:mm"
const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberId, date } }) => {
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          barberId: barberId,
        },
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: "CANCELLED" },
      },
      select: {
        date: true,
      },
    });

    const day = date.getDay(); // 0 (Domingo) a 6 (Sábado)

    const availability = await prisma.disponibility.findFirst({
      where: {
        barberId,
        dayOfWeek: day,
      },
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    });

    if (!availability) {
      return [];
    }
    if (availability.dayOfWeek !== day) {
      return [];
    }

    const occupiedSlots = bookings.map(b => format(b.date, "HH:mm"));

    const start = timeToMinutes(availability.startTime);
    const end = timeToMinutes(availability.endTime);
    const interval = 30;

    const dynamicSlots: string[] = [];

    for (let time = start; time <= end; time += interval) {
      const timeString = minutesToTime(time);
      if (!occupiedSlots.includes(timeString)) {
        dynamicSlots.push(timeString);
      }
    }

    return dynamicSlots;
  });
