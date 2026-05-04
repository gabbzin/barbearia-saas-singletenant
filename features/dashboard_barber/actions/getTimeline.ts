import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { timeDateToString, timeToMinutes } from "@/utils/convertTimes";

type TimelineItem = {
  id: string;
  type: string;
  eventTime: string;
  description: string;
  sortMinutes: number;
  isCurrent?: boolean;
};

export type TimelineArray = Array<Omit<TimelineItem, "sortMinutes">>;

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
        prisma.disponibility.findFirst({
          where: {
            barberId,
            dayOfWeek,
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
            customerName: true,
          },
          orderBy: {
            date: "asc",
          },
        }),
      ]);

    if (!disponibility || !barberBreaks || !exceptionDates || !bookings) {
      return null;
    }

    const nowInMinutes = timeToMinutes(
      formatInTimeZone(now, DEFAULT_TIMEZONE, "HH:mm"),
    );

    const isClosedFullTime = exceptionDates.some(item => {
      return item.isClosedFullTime === true;
    });

    if (isClosedFullTime) {
      return { finalArray: [] };
    }

    const finalArray: TimelineItem[] = [
      {
        id: `start_${disponibility.id}`,
        type: "disponibility",
        eventTime: timeDateToString(disponibility.startTime),
        description: "Inicio do turno",
        sortMinutes: timeToMinutes(disponibility.startTime),
      },
    ];

    formatInfos({
      result: [...barberBreaks, ...exceptionDates, ...bookings],
      finalArray,
    });

    finalArray.push({
      id: `end_${disponibility.id}`,
      type: "disponibility",
      eventTime: timeDateToString(disponibility.endTime),
      description: "Fim do turno",
      sortMinutes: timeToMinutes(disponibility.endTime),
    });

    finalArray.sort((a, b) => {
      return a.sortMinutes - b.sortMinutes;
    });

    let currentIndex = -1;

    for (let i = 0; i < finalArray.length; i++) {
      if (finalArray[i].sortMinutes < nowInMinutes) {
        currentIndex = i;
      } else {
        break;
      }
    }

    if (currentIndex === -1 && finalArray.length > 0) {
      currentIndex = 0;
    }

    return {
      finalArray: finalArray.map(({ sortMinutes, ...item }, index) => ({
        ...item,
        isCurrent: index === currentIndex,
      })),
      currentIndex,
    };
  } catch (error) {
    console.error("Error fetching timeline data:", error);
    throw error;
  }
});

interface formatInfosProps {
  // biome-ignore lint/suspicious/noExplicitAny: <Não precisa de tipagem estrita aqui, pois o formato dos dados é complexo e varia entre breaks, exceptionDates e bookings>
  result: any[];
  finalArray: TimelineItem[];
}

type TimelineSortItem = {
  startTime?: Date | null;
  date?: Date | null;
  isClosedFullTime?: boolean;
  motivo?: string | null;
};

function formatInfos({ result, finalArray }: formatInfosProps) {
  for (const item of result) {
    let id: string;
    let type: string;
    let eventTime: string;
    let description: string;

    if ("isClosedFullTime" in item) {
      // Se tem isClosedFullTime, é uma exceptionDate
      id = `exception_${item.id}`;
      type = "exception";
      eventTime = timeDateToString(item.startTime);
      description = item.isClosedFullTime
        ? "Fechado o dia todo"
        : "Início da Exceção parcial";

      if (item.motivo) {
        description = `${description}: ${item.motivo}`;
      }

      if (!item.isClosedFullTime && item.endTime) {
        finalArray.push({
          id: `exception_end_${item.id}`,
          type,
          eventTime: timeDateToString(item.endTime),
          description: "Fim da Exceção parcial",
          sortMinutes: getTimelineItemSortMinutes({
            startTime: item.endTime,
          }),
        });
      }
    } else if ("user" in item) {
      // Se tem user, é um booking
      id = `booking_${item.id}`;
      type = "booking";
      eventTime = formatInTimeZone(item.date, DEFAULT_TIMEZONE, "HH:mm");
      description = `Agendamento: ${item.user.name.toLowerCase() === "ghost user" ? item.customerName : item.user.name}`;
    } else {
      // Caso contrário, é um barberBreak
      id = `break_${item.id}`;
      type = "break";
      eventTime = timeDateToString(item.startTime);
      description = `Intervalo ${item.motivo}`;

      if (item.endTime) {
        finalArray.push({
          id: `break_end_${item.id}`,
          type,
          eventTime: timeDateToString(item.endTime),
          description: `Intervalo ${item.motivo} (fim)`,
          sortMinutes: getTimelineItemSortMinutes({
            startTime: item.endTime,
          }),
        });
      }
    }

    finalArray.push({
      id,
      type,
      eventTime,
      description,
      sortMinutes: getTimelineItemSortMinutes(item),
    });
  }
}

function getTimelineItemSortMinutes(item: TimelineSortItem) {
  if ("startTime" in item && item.startTime instanceof Date) {
    return timeToMinutes(item.startTime);
  }

  if ("date" in item && item.date instanceof Date) {
    return timeToMinutes(
      formatInTimeZone(item.date, DEFAULT_TIMEZONE, "HH:mm"),
    );
  }

  return 0;
}
