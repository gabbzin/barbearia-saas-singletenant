"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import { barberRoutes } from "@/shared/constants/routes";

export async function confirmBooking(bookingId: string) {
  const barber = await verifySession();

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.barberId !== barber?.barberId) {
    throw new Error("Unauthorized");
  }

  const isPast = booking.date < new Date();

  if (!isPast) {
    throw new Error("Cannot confirm a booking that has not yet occurred");
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  return revalidatePath(barberRoutes.schedule);
}
