"use server";

import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import {
  createRange,
  minutesToTime,
  timeDateToString,
  timeToMinutes,
} from "@/utils/convertTimes";

const inputSchema = z.object({
  barberId: z.string(),
  servicesIds: z.array(z.string()),
  date: z.date(),
  bookingBufferBool: z.boolean().default(true), // Serve para dar permissão de agendar encima da hora
});

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(
    async ({
      parsedInput: { barberId, servicesIds, date, bookingBufferBool },
    }) => {
      const session = await verifySession();

      if (!session) {
        return returnValidationErrors(inputSchema, {
          _errors: ["Unauthorized"],
        });
      }

      const { day, dayRangeStart, dayRangeEnd, queryDateInTimezone } =
        normalizeToTimezone(date, DEFAULT_TIMEZONE);

      const availability = await verifyDisponibility(barberId, day);

      if (!availability) {
        return [];
      }

      const [breaks, exceptions, services, bookings] = await Promise.all([
        verifyBreaks(barberId, day),
        verifyExceptions(barberId, dayRangeStart, dayRangeEnd),
        prisma.barberService.findMany({
          where: {
            id: { in: servicesIds },
            barberId,
          },
          select: {
            durationInMinutes: true,
          },
        }),
        prisma.booking.findMany({
          where: {
            barberId,
            date: {
              gte: dayRangeStart,
              lte: dayRangeEnd,
            },
            status: { not: "CANCELLED" },
          },
          select: {
            date: true,
            services: {
              select: {
                durationInMinutes: true,
              },
            },
          },
        }),
      ]);

      if (exceptions.some(e => e.isClosedFullTime)) {
        return [];
      }

      if (!services || services.length !== servicesIds.length) {
        return returnValidationErrors(inputSchema, {
          _errors: [
            "Um ou mais serviços são inválidos ou não pertencem a este barbeiro.",
          ],
        });
      }

      const serviceDuration = services.reduce(
        (acc, curr) => acc + curr.durationInMinutes,
        0,
      );

      const bookingRanges = bookings.map(booking => {
        const start = timeToMinutes(
          formatInTimeZone(booking.date, DEFAULT_TIMEZONE, "HH:mm"),
        );
        const end =
          start +
          booking.services.reduce(
            (acc, curr) => acc + curr.durationInMinutes,
            0,
          );

        return { start, end };
      });

      const breakRanges = breaks.map(barberBreak =>
        createRange(barberBreak.startTime, barberBreak.endTime),
      );

      const exceptionRanges = exceptions
        .filter(e => e.startTime && e.endTime)
        .map(exception => {
          const startTime = timeDateToString(exception.startTime as Date);
          const endTime = timeDateToString(exception.endTime as Date);
          return createRange(startTime, endTime);
        });

      const blockedRanges = [
        ...bookingRanges,
        ...breakRanges,
        ...exceptionRanges,
      ];

      const shiftStart = timeToMinutes(availability.startTime);
      const shiftEnd = timeToMinutes(availability.endTime);

      const availableTimeSlots = await getTimeSlots(
        blockedRanges,
        shiftStart,
        shiftEnd,
        serviceDuration,
        queryDateInTimezone,
        bookingBufferBool,
      );

      return availableTimeSlots;
    },
  );

async function verifyDisponibility(barberId: string, day: number) {
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

  return availability;
}

async function verifyExceptions(
  barberId: string,
  dayRangeStart: Date,
  dayRangeEnd: Date,
) {
  return await prisma.exceptionDate.findMany({
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
}

async function verifyBreaks(barberId: string, day: number) {
  return await prisma.barberBreak.findMany({
    where: {
      barberId,
      dayOfWeek: day,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });
}

function normalizeToTimezone(date: Date, timezone: string) {
  const isoDay = Number(formatInTimeZone(date, timezone, "i"));
  const day = isoDay % 7; // 0 (Domingo) a 6 (Sábado)
  const queryDateInTimezone = formatInTimeZone(date, timezone, "yyyy-MM-dd");

  const dayRangeStart = fromZonedTime(
    `${queryDateInTimezone}T00:00:00.000`,
    timezone,
  );
  const dayRangeEnd = fromZonedTime(
    `${queryDateInTimezone}T23:59:59.999`,
    timezone,
  );

  return {
    day,
    dayRangeStart,
    dayRangeEnd,
    queryDateInTimezone,
  };
}

async function getTimeSlots(
  blockedRanges: { start: number; end: number }[],
  shiftStart: number,
  shiftEnd: number,
  serviceDuration: number,
  queryDateInTimezone: string,
  bookingBufferBool: boolean,
) {
  const dynamicSlots: string[] = [];
  const interval = 15;
  // Lógica para bloquear horários que já passaram hoje
  const now = new Date();
  const todayInTimezone = formatInTimeZone(now, DEFAULT_TIMEZONE, "yyyy-MM-dd");
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
}
