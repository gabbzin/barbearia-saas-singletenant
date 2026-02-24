import type { Barbershop } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BarbershopStore {
  barbershop: Barbershop | null;
  setBarbershop: (barbershop: Barbershop) => void;
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
