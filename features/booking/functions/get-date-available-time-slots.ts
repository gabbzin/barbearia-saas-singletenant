"use server";

import { endOfDay, format, isToday, startOfDay } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
// import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
// import { auth } from "@/lib/auth";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  date: z.date(),
  bookingBufferBool: z.boolean().default(true),
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

const createRange = (start: string, end: string) => ({
  start: timeToMinutes(start),
  end: timeToMinutes(end),
});

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(
    async ({
      parsedInput: { barberId, serviceId, date, bookingBufferBool },
    }) => {
      const session = await verifySession();

      if (!session) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Unauthorized"],
        });
      }

      const service = await prisma.barberService.findUnique({
        where: {
          id: serviceId,
        },
        select: {
          durationInMinutes: true,
        },
      });

      if (!service) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Serviço não encontrado"],
        });
      }

      const serviceDuration = service.durationInMinutes;

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
          service: {
            select: {
              durationInMinutes: true,
            },
          },
        },
      });

      const day = date.getDay(); // 0 (Domingo) a 6 (Sábado)

      const availability = await prisma.disponibility.findFirst({
        where: {
          barberId,
          dayOfWeek: day,
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      if (!availability) {
        return [];
      }

      const breaks = await prisma.barberBreak.findMany({
        where: {
          barberId,
          dayOfWeek: day,
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      const exceptions = await prisma.exceptionDate.findMany({
        where: {
          barberId,
          date: {
            gte: startOfDay(date),
            lte: endOfDay(date),
          },
        },
        select: {
          isClosedFullTime: true,
          startTime: true,
          endTime: true,
        },
      });

      const fullClosed = exceptions.some(e => e.isClosedFullTime);

      if (fullClosed) {
        return [];
      }

      const bookingRanges = bookings.map(booking => {
        const start = timeToMinutes(format(booking.date, "HH:mm"));
        const end = start + booking.service.durationInMinutes;

        return { start, end };
      });

      const breakRanges = breaks.map(barberBreak =>
        createRange(barberBreak.startTime, barberBreak.endTime),
      );

      const exceptionRanges = exceptions
        .filter(e => e.startTime && e.endTime)
        .map(exception =>
          createRange(exception.startTime!, exception.endTime!),
        );

      const blockedRanges = [
        ...bookingRanges,
        ...breakRanges,
        ...exceptionRanges,
      ];

      const shiftStart = timeToMinutes(availability.startTime);
      const shiftEnd = timeToMinutes(availability.endTime);

      const dynamicSlots: string[] = [];
      const interval = 15;
      // Lógica para bloquear horários que já passaram hoje
      const now = new Date();
      const isQueryingToday = isToday(date);

      const currentTimeInTimezone = new Intl.DateTimeFormat("pt-BR", {
        timeZone: DEFAULT_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      const [currentHour, currentMinute] = currentTimeInTimezone
        .split(":")
        .map(Number);

      const currentMinutes = currentHour * 60 + currentMinute;

      // Tempo de antecedência mínima para agendar (30 minutos)
      // Agendamento manual tem que ser sem o buffer, para permitir que o admin faça agendamento de última hora
      const bookingBuffer = bookingBufferBool ? 30 : 0;

      for (
        let time = shiftStart;
        time + serviceDuration <= shiftEnd;
        time += interval
      ) {
        if (isQueryingToday && time < currentMinutes + bookingBuffer) {
          continue; // Pula horários que já passaram ou estão muito próximos
        }

        const proposedStart = time;
        const proposedEnd = time + serviceDuration;

        const hasConflict = blockedRanges.some(range => {
          return proposedStart < range.end && proposedEnd > range.start;
        });

        if (!hasConflict) {
          dynamicSlots.push(minutesToTime(proposedStart));
        }
      }

      return dynamicSlots;
    },
  );
