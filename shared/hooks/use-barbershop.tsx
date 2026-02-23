"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";

type Barbershop = {
  name: string;
  address: string;
  imageUrl: string;
};

let barbershopCache: Barbershop | null = null;
let barbershopPromise: Promise<Barbershop | null> | null = null;

export function useBarbershop() {
  const [data, setData] = useState<Barbershop | null>(barbershopCache);
  const { executeAsync, isPending } = useAction(getInfosBarbershop as any);

  useEffect(() => {
    if (barbershopCache) return;

    if (!barbershopPromise) {
      barbershopPromise = executeAsync()
        .then((res: any) => {
          // normalize
          const parsed: Barbershop = {
            name: res?.name ?? "",
            address: res?.address ?? "",
            imageUrl: res?.imageUrl ?? "",
          };
          barbershopCache = parsed;
          return parsed;
        })
        .catch(() => {
          barbershopCache = null;
          return null;
        });
    }

    barbershopPromise.then(res => {
      setData(res);
    });
  }, [executeAsync]);

  const refresh = async () => {
    const res: any = await executeAsync();
    const parsed: Barbershop = {
      name: res?.name ?? "",
      address: res?.address ?? "",
      imageUrl: res?.imageUrl ?? "",
    };
    barbershopCache = parsed;
    setData(parsed);
    return parsed;
  };

  return { data, isLoading: isPending && !data, refresh } as const;
}
