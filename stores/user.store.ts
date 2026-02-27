import { create } from "zustand";
import type { UserSession } from "@/features/user/repository/user.repository";

interface UserStore {
  user: UserSession | null;
  setUser: (user: UserSession) => void;
}

export const useUserStore = create<UserStore>()(set => ({
  user: null,
  setUser: user => set({ user }),
}));
