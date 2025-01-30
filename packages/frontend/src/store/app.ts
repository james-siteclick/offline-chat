import { User } from "@offline-chat/backend";
import { create } from "zustand";
import { UserWithToken } from "../data/auth";

interface AppState {
  user?: User;
  token?: string;
  isOnline: boolean;
  login: (userWithToken: UserWithToken) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  user: undefined,
  token: undefined,
  isOnline: navigator.onLine,
  login({ user, token }: UserWithToken) {
    set((state) => ({
      ...state,
      user,
      token,
    }));
  },
  logout() {
    set((state) => ({
      ...state,
      user: undefined,
      token: undefined,
    }));
  },
}));
