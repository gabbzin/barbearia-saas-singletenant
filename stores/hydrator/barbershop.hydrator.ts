"use client";

import { useEffect } from "react";
import { useBarbershopStore } from "../barbershop.store";

export function BarbershopHydrator({ data }: { data: any }) {
  const setBarbershop = useBarbershopStore(s => s.setBarbershop);

  useEffect(() => {
    if (data) {
      setBarbershop(data);
    }
  }, [data, setBarbershop]);

  return null;
}
