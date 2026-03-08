"use server";

import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { getLastBookingClient } from "../functions/get-bookings";

export const getLastBookingAction = actionClient.action(async () => {
  const session = await verifySession();

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = session.id;

  const lastBooking = await getLastBookingClient(userId);

  if (!lastBooking) {
    return null;
  }

  return lastBooking;
});
