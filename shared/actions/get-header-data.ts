"use server";

import { getBarbers } from "@/features/barber/services/barbers.repository";
import {
  getCurrentSubscription,
  verifySession,
} from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";

export const getHeaderData = actionClient.action(async () => {
  const [barbers, isSubscriber, session] = await Promise.all([
    getBarbers(),
    getCurrentSubscription(),
    verifySession(),
  ]);

  return {
    barbers,
    isSubscriber,
    session,
  };
});
