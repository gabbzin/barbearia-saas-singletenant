"use client";

import type { Barber } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { getBarbersAction } from "@/features/barber/actions/get-barbers-action";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useBarbers() {
  const { executeAsync } = useAction(getBarbersAction);
  const { data, isLoading } = useSafeQuery<{ barbers: Barber[] }>(
    ["barbers"],
    () => executeAsync(),
  );

  return { barbers: data?.barbers ?? null, isPending: isLoading } as const;
}
