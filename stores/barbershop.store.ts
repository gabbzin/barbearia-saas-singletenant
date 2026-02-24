import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BarbershopInfo } from "@/shared/actions/get-infos-barbershop";

interface BarbershopStore {
  barbershop: BarbershopInfo | null;
  setBarbershop: (barbershop: BarbershopInfo) => void;
}

export const useBarbershopStore = create<BarbershopStore>()(
  persist(
    set => ({
      barbershop: null,
      setBarbershop: barbershop => set({ barbershop }),
    }),
    {
      name: "barbershop-storage",
    },
  ),
);
