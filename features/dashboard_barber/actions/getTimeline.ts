import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { timeDateToString } from "@/utils/convertTimes";

type TimelineItem = {
  id: string;
  type: string;
  eventTime: string;
  description: string;
};

type TimelineArray = TimelineItem[];

export const getTimeline = actionClient.action(async () => {
  try {
    const session = await verifySession();

    if (!session || session.role !== "BARBER") {
      throw new Error("Unauthorized");
    }

    const now = new Date();
    const queryDateInTimezone = formatInTimeZone(
      now,
      DEFAULT_TIMEZONE,
      "yyyy-MM-dd",
    );
    const isoDay = Number(formatInTimeZone(now, DEFAULT_TIMEZONE, "i"));
    const dayOfWeek = isoDay % 7;
    const dayRangeStart = fromZonedTime(
      `${queryDateInTimezone}T00:00:00.000`,
      DEFAULT_TIMEZONE,
    );
    const dayRangeEnd = fromZonedTime(
      `${queryDateInTimezone}T23:59:59.999`,
      DEFAULT_TIMEZONE,
    );

    const barberId = session.barberId as string;

    const [disponibility, barberBreaks, exceptionDates, bookings] =
      await Promise.all([
        // Buscando disponibilidade do dia de hoje
        prisma.disponibility.findUnique({
          where: {
            barberId_dayOfWeek: {
              barberId,
              dayOfWeek,
            },
          },
        }),
        // Buscando os intervalos de break cadastrados para o dia de hoje
        prisma.barberBreak.findMany({
          where: {
            barberId,
            dayOfWeek,
          },
          orderBy: {
            startTime: "asc",
          },
        }),
        // Buscando as exceções para o dia de hoje
        prisma.exceptionDate.findMany({
          where: {
            barberId,
            date: {
              gte: dayRangeStart,
              lte: dayRangeEnd,
            },
          },
          orderBy: {
            date: "asc",
          },
        }),
        // Buscando os agendamentos para o dia de hoje
        prisma.booking.findMany({
          where: {
            barberId,
            date: {
              gte: dayRangeStart,
              lte: dayRangeEnd,
            },
            status: {
              not: "CANCELLED",
            },
          },
          select: {
            id: true,
            date: true,
            status: true,
            services: {
              select: {
                name: true,
                durationInMinutes: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        }),
      ]);

    if (!disponibility || !barberBreaks || !exceptionDates || !bookings) {
      return null;
    }

    const result = [...barberBreaks, ...exceptionDates, ...bookings].sort(
      (a, b) => {
        const infoA =
          "startTime" in a ? a.startTime : "date" in a ? a.date : null;
        const infoB =
          "startTime" in b ? b.startTime : "date" in b ? b.date : null;

        if (!infoA || !infoB) {
          return 0;
        }

        return infoA.getTime() - infoB.getTime();
      },
    );

    // Array final sempre começa com a disponibilidade inicial, marco zero
    const finalArray: TimelineArray = [
      {
        id: `start_${disponibility.id}`,
        type: "disponibility",
        eventTime: timeDateToString(disponibility.startTime),
        description: "Inicio do turno",
      },
    ];

    finalArray.push({
      id: `end_${disponibility.id}`,
      type: "disponibility",
      eventTime: timeDateToString(disponibility.endTime),
      description: "Fim do turno",
    });

    return {
      disponibility,
      barberBreaks,
      exceptionDates,
      bookings,
    };
  } catch (error) {
    console.error("Error fetching timeline data:", error);
    throw error;
  }
});
