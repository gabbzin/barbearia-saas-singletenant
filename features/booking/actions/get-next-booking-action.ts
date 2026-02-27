"use server";

import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { getNextBooking } from "../functions/get-bookings";

export const getNextBookingAction = actionClient.action(async () => {
  const session = await verifySession();

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = session.id;

  const nextBooking = await getNextBooking(userId);

  if (!nextBooking) {
    return null;
  }

  return nextBooking;
});
