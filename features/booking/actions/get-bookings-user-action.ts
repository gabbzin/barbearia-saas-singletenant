"use server";

import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { getBookingsClient } from "../functions/get-bookings";

export const getBookingsUserIdAction = actionClient.action(async () => {
  const session = await verifySession();

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const userId = session.id;

  const bookings = await getBookingsClient(userId);

  if (!bookings) {
    return null;
  }

  return bookings;
});
