"use server";

import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

export const getLastBookingAction = actionClient.action(async () => {
  const session = await verifySession();

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = session.id;

  const lastBooking = await prisma.booking.findFirst({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (!lastBooking) {
    return { lastBooking: null };
  }

  const lastDate = lastBooking.date;
  return { lastDate: lastDate };
});
