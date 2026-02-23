"use client";

import type { Barber } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { getBarbersAction } from "@/features/barber/actions/get-barbers-action";

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[] | null>(null);
  const { executeAsync, isPending } = useAction(getBarbersAction);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const result = await executeAsync();
      if (!mounted) return;
      if (result?.serverError || result?.validationErrors) return;

      setBarbers(result?.data?.barbers || []);
    })();

    return () => {
      mounted = false;
    };
  }, [executeAsync]);

  return { barbers, isPending } as const;
}
