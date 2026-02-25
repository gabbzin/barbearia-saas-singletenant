"use client";

import { useQuery } from "@tanstack/react-query";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import {
  getCurrentSubscription,
  verifySession,
} from "@/features/user/repository/user.repository";

export async function fetchHeaderData() {
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
}

export function useHeaderData() {
  return useQuery({
    queryKey: ["header-data"],
    queryFn: fetchHeaderData,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
