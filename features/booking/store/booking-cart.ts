import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BOOKING_CART_KEY = "booking-cart";

interface BookingCartStore {
  items: BookingCartItem[];
  addItem: (item: BookingCartItem) => void;
  removeItem: (serviceId: string) => void;
  clearCart: () => void;
}

interface BookingCartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number; // duração em minutos
}

export const useBookingCart = create<BookingCartStore>()(
  persist(
    set => ({
      // Estado inicial do carrinho
      items: [],

      // Adiciona um item ao carrinho
      addItem: (item: BookingCartItem) =>
        set(state => ({ items: [...state.items, item] })),

      // Remove item do carrinho
      removeItem: (serviceId: string) =>
        set(state => ({
          items: state.items.filter(item => item.serviceId === serviceId),
        })),

      // Limpa o carrinho
      clearCart: () =>
        set(() => ({
          items: [],
        })),
    }),
    {
      name: BOOKING_CART_KEY,
    },
  ),
);
