"use client";

import { useEffect } from "react";
import type { UserSession } from "@/features/user/repository/user.repository";
import type { BarbershopInfo } from "@/shared/actions/get-infos-barbershop";
import { useBarbershopStore } from "../barbershop.store";
import { useUserStore } from "../user.store";

interface BarbershopHydratorProps {
  barbershopData: BarbershopInfo;
  userData: UserSession;
}

export function BarbershopHydrator({
  barbershopData,
  userData,
}: BarbershopHydratorProps) {
  const setBarbershop = useBarbershopStore(s => s.setBarbershop);
  const setUser = useUserStore(s => s.setUser);

  useEffect(() => {
    if (barbershopData) {
      setBarbershop(barbershopData);
    }

    if (userData) {
      setUser(userData);
    }
  }, [barbershopData, userData, setBarbershop, setUser]);

  return null;
}
