import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import {
  createRange,
  minutesToTime,
  timeDateToString,
  timeToMinutes,
} from "@/utils/convertTimes";

export interface AvailableTimeSlotsInput {
  barberId: string;
  serviceIds: string[];
  date: Date;
  bookingBufferBool?: boolean;
}

export class InvalidServicesError extends Error {
  constructor() {
    super("Um ou mais serviços são inválidos ou não pertencem a este barbeiro.");
  }
}

export async function getAvailableTimeSlotsService(
  input: AvailableTimeSlotsInput,
): Promise<string[]> {
  const { barberId, serviceIds, date, bookingBufferBool = true } = input;

  const { day, dayRangeStart, dayRangeEnd, queryDateInTimezone } =
    normalizeToTimezone(date, DEFAULT_TIMEZONE);

  const availability = await prisma.disponibility.findFirst({
    where: { barberId, dayOfWeek: day },
    select: { startTime: true, endTime: true },
  });

  if (!availability) return [];

  const [breaks, exceptions, services, bookings] = await Promise.all([
    prisma.barberBreak.findMany({
      where: { barberId, dayOfWeek: day },
      select: { startTime: true, endTime: true },
    }),
    prisma.exceptionDate.findMany({
      where: {
        barberId,
        date: { gte: dayRangeStart, lte: dayRangeEnd },
      },
      select: { isClosedFullTime: true, startTime: true, endTime: true },
    }),
    prisma.barberService.findMany({
      where: { id: { in: serviceIds }, barberId },
      select: { durationInMinutes: true },
    }),
    prisma.booking.findMany({
      where: {
        barberId,
        date: { gte: dayRangeStart, lte: dayRangeEnd },
        status: { not: "CANCELLED" },
      },
      select: {
        date: true,
        services: { select: { durationInMinutes: true } },
      },
    }),
  ]);

  if (exceptions.some(e => e.isClosedFullTime)) return [];

  if (services.length !== serviceIds.length) {
    throw new InvalidServicesError();
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
      booking.services.reduce((acc, curr) => acc + curr.durationInMinutes, 0);
    return { start, end };
  });

  const breakRanges = breaks.map(b => createRange(b.startTime, b.endTime));

  const exceptionRanges = exceptions
    .filter(e => e.startTime && e.endTime)
    .map(e => {
      const start = timeDateToString(e.startTime as Date);
      const end = timeDateToString(e.endTime as Date);
      return createRange(start, end);
    });

  const blockedRanges = [...bookingRanges, ...breakRanges, ...exceptionRanges];
  const shiftStart = timeToMinutes(availability.startTime);
  const shiftEnd = timeToMinutes(availability.endTime);

  return computeTimeSlots({
    blockedRanges,
    shiftStart,
    shiftEnd,
    serviceDuration,
    queryDateInTimezone,
    bookingBufferBool,
  });
}

function normalizeToTimezone(date: Date, timezone: string) {
  const isoDay = Number(formatInTimeZone(date, timezone, "i"));
  const day = isoDay % 7;
  const queryDateInTimezone = formatInTimeZone(date, timezone, "yyyy-MM-dd");
  const dayRangeStart = fromZonedTime(
    `${queryDateInTimezone}T00:00:00.000`,
    timezone,
  );
  const dayRangeEnd = fromZonedTime(
    `${queryDateInTimezone}T23:59:59.999`,
    timezone,
  );
  return { day, dayRangeStart, dayRangeEnd, queryDateInTimezone };
}

function computeTimeSlots({
  blockedRanges,
  shiftStart,
  shiftEnd,
  serviceDuration,
  queryDateInTimezone,
  bookingBufferBool,
}: {
  blockedRanges: { start: number; end: number }[];
  shiftStart: number;
  shiftEnd: number;
  serviceDuration: number;
  queryDateInTimezone: string;
  bookingBufferBool: boolean;
}): string[] {
  const slots: string[] = [];
  const interval = 15;

  const now = new Date();
  const todayInTimezone = formatInTimeZone(now, DEFAULT_TIMEZONE, "yyyy-MM-dd");
  const isToday = queryDateInTimezone === todayInTimezone;

  const currentTimeFormatted = new Intl.DateTimeFormat("pt-BR", {
    timeZone: DEFAULT_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const [h, m] = currentTimeFormatted.split(":").map(Number);
  const currentMinutes = h * 60 + m;
  const buffer = bookingBufferBool ? 30 : 0;

  for (
    let time = shiftStart;
    time + serviceDuration <= shiftEnd;
    time += interval
  ) {
    if (isToday && time < currentMinutes + buffer) continue;

    const proposedEnd = time + serviceDuration;
    const hasConflict = blockedRanges.some(
      r => time < r.end && proposedEnd > r.start,
    );

    if (!hasConflict) slots.push(minutesToTime(time));
  }

  return slots;
}
