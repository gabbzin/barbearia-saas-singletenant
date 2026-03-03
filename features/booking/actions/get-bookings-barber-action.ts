"use server";

import { getBookingsBarber } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";

export const getBookingsBarberAction = actionClient.action(async () => {
  const session = await verifySession();

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  if (!session.barberId) {
    throw new Error("Usuário não autorizado.");
  }

  const bookings = await getBookingsBarber(session.barberId);
  return { bookings };
});
