"use server";

import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getBookingsBarber(barberId: string, targetDate?: Date) {
  const baseDate = targetDate ?? new Date();
  const startDay = startOfDay(baseDate);
  const endDay = endOfDay(baseDate);

  const bookings = await prisma.booking.findMany({
    where: {
      barberId: barberId,
      date: {
        gte: startDay,
        lte: endDay,
      },
    },
    include: {
      user: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return bookings;
}

export async function getBookingsUser(userId: string) {
  return await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    include: {
      service: {
        include: {
          barber: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getNextBooking(userId: string) {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
      status: "SCHEDULED",
      date: {
        gt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barber: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}
