/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const BOOKING_CART_KEY = "booking-cart";

interface CartStore {
  items: CartItem[];
  barberId: string | null;
  addItem: (item: CartItem, barberId: string) => CartOperationResult;
  removeItem: (serviceId: string) => CartOperationResult;
  clearCart: () => CartOperationResult;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number; // duração em minutos
}

// Helpers de retorno
type CartOperationResult = {
  success: boolean;
  message: string;
};

const successResult = (message: string): CartOperationResult => ({
  success: true,
  message,
});

const errorResult = (message: string): CartOperationResult => ({
  success: false,
  message,
});

// Estado global
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial do carrinho
      items: [],
      barberId: null,

      // Adiciona um item ao carrinho
      addItem: (item: CartItem, barberId: string) => {
        const state = get();

        // Regra 1 => O carrinho só pode conter itens de um barbeiro por vez
        if (state.barberId && state.barberId !== barberId) {
          return errorResult("Você já tem itens de outro barbeiro no carrinho");
        }

        // Regra 2 => Verificar se o serviço já existe no carrinho
        const exists = state.items.some(i => i.serviceId === item.serviceId);
        if (exists) {
          return errorResult("Este serviço já está no carrinho");
        }

        // Atualiza o estado do carrinho com o novo item
        set({ barberId: barberId, items: [...state.items, item] });

        return successResult("Serviço adicionado ao carrinho");
      },

      // Remove item do carrinho
      removeItem: (serviceId: string) => {
        const state = get();
        const newItems = state.items.filter(
          item => item.serviceId !== serviceId,
        );

        set({
          items: newItems,
          barberId: newItems.length > 0 ? state.barberId : null,
        });

        return successResult("Serviço removido do carrinho");
      },

      // Limpa o carrinho
      clearCart: () => {
        set({
          items: [],
          barberId: null,
        });

        return successResult("Carrinho limpo");
      },

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
          const state = persistedState as Partial<CartStore>;

          return {
            ...currentState,
            items: state.items ?? [],
            barberId: state.barberId ?? null,
          };
        }

        return currentState;
      },
    },
  ),
);
