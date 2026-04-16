/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const BOOKING_CART_KEY = "booking-cart";

interface BookingCartStore {
  items: BookingCartItem[];
  barberId: string | null;
  addItem: (item: BookingCartItem, barberId: string) => void;
  removeItem: (serviceId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}

interface BookingCartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number; // duração em minutos
}

export const useBookingCart = create<BookingCartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial do carrinho
      items: [],
      barberId: null,

      // Adiciona um item ao carrinho
      addItem: (item: BookingCartItem, barberId: string) =>
        set(state => {
          if (state.barberId && state.barberId !== barberId) {
            toast.error(
              "Você só pode adicionar serviços de um barbeiro por vez.",
            );
            return state;
          }

          const exists = state.items.some(i => i.serviceId === item.serviceId);

          if (exists) return state;

          return { barberId: barberId, items: [...state.items, item] };
        }),

      // Remove item do carrinho
      removeItem: (serviceId: string) =>
        set(state => ({
          items: state.items.filter(item => item.serviceId !== serviceId),
        })),

      // Limpa o carrinho
      clearCart: () =>
        set(() => ({
          items: [],
        })),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price, 0),

      getTotalDuration: () =>
        get().items.reduce((acc, item) => acc + item.duration, 0),
    }),
    {
      name: BOOKING_CART_KEY,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState) => {
        if (
          persistedState &&
          typeof persistedState === "object" &&
          "items" in persistedState
        ) {
          const state = persistedState as Partial<BookingCartStore>;

          return {
            ...currentState,
            items: state.items ?? [],
          };
        }

        return currentState;
      },
    },
  ),
);
