"use server";

import { getBarbers } from "@/features/barber/services/barbers.repository";
import { actionClient } from "@/lib/actionClient";

export const getBarbersAction = actionClient.action(async () => {
  const barbers = await getBarbers();
  return { barbers };
});
