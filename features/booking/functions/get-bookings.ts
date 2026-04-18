"use server";

import { endOfDay, startOfDay } from "date-fns";
import { GHOST_USER_ID } from "@/lib/consts";
import { prisma } from "@/lib/prisma";

export async function getBookingsBarber(
  barberId: string,
  targetDate?: Date,
  take?: number,
  untilNow: boolean = false,
) {
  const baseDate = targetDate ?? new Date();
  const startDay = startOfDay(baseDate);
  const endDay = endOfDay(baseDate);

  const bookings = await prisma.booking.findMany({
    where: {
      barberId: barberId,
      date: {
        gte: untilNow ? new Date() : startDay,
        lte: endDay,
      },
      status: "SCHEDULED",
    },
    include: {
      user: true,
      services: true,
    },
    orderBy: {
      date: "asc",
    },
    take: take ?? undefined,
  });

  // Usar customer, pois o campo de usuário pode mudar, mas o cliente é o mesmo.
  return bookings.map(booking => ({
    ...booking,
    client:
      booking.userId === GHOST_USER_ID
        ? {
            name: booking.customerName ?? "Cliente",
            phone: booking.customerPhone ?? "Telefone não informado",
            image: "",
          }
        : booking.user,
    user: undefined,
  }));
}

export async function getBookingsClient(userId: string) {
  return await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    include: {
      services: true,
      barber: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getNextBookingClient(userId: string) {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
      status: "SCHEDULED",
      date: {
        gt: new Date(),
      },
    },
    include: {
      services: true,
      barber: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getLastBookingClient(userId: string) {
  return await prisma.booking.findFirst({
    where: {
      userId,
      status: "COMPLETED",
      rating: {
        is: null,
      },
    },
    include: {
      services: true,
      barber: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}
