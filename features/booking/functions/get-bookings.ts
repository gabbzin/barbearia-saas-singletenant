"use server";

import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getBookingsBarber(barberId: string) {
  const startDay = startOfDay(new Date());
  const endDay = endOfDay(new Date());

  const bookings = await prisma.booking.findMany({
    where: {
      barberId: barberId,
    },
    include: {
      user: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  console.log(bookings);
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
