"use server";

import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { returnValidationErrors } from "next-safe-action";
// import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
// import { auth } from "@/lib/auth";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import {
  createRange,
  minutesToTime,
  timeToMinutes,
} from "@/utils/convertTimes";

const inputSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  date: z.date(),
  bookingBufferBool: z.boolean().default(true), // Serve para dar permissão de agendar encima da hora
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

      const queryDateInTimezone = formatInTimeZone(
        date,
        DEFAULT_TIMEZONE,
        "yyyy-MM-dd",
      );

      const dayRangeStart = fromZonedTime(
        `${queryDateInTimezone}T00:00:00.000`,
        DEFAULT_TIMEZONE,
      );
      const dayRangeEnd = fromZonedTime(
        `${queryDateInTimezone}T23:59:59.999`,
        DEFAULT_TIMEZONE,
      );

      const bookings = await prisma.booking.findMany({
        where: {
          service: {
            barberId: barberId,
          },
          date: {
            gte: dayRangeStart,
            lte: dayRangeEnd,
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

      const isoDay = Number(formatInTimeZone(date, DEFAULT_TIMEZONE, "i"));
      const day = isoDay % 7; // 0 (Domingo) a 6 (Sábado)

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
            gte: dayRangeStart,
            lte: dayRangeEnd,
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
        const start = timeToMinutes(
          formatInTimeZone(booking.date, DEFAULT_TIMEZONE, "HH:mm"),
        );
        const end = start + booking.service.durationInMinutes;

        return { start, end };
      });

      const breakRanges = breaks.map(barberBreak =>
        createRange(barberBreak.startTime, barberBreak.endTime),
      );

      const exceptionRanges = exceptions
        .filter(e => e.startTime && e.endTime)
        .map(exception => {
          const startTime = exception.startTime!.toISOString().slice(11, 16);
          const endTime = exception.endTime!.toISOString().slice(11, 16);
          return createRange(startTime, endTime);
        });

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
      const todayInTimezone = formatInTimeZone(
        now,
        DEFAULT_TIMEZONE,
        "yyyy-MM-dd",
      );
      const isQueryingToday = queryDateInTimezone === todayInTimezone;

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
