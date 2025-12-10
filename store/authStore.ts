"use client";

import { User } from "@/types";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  loadingUser: boolean;
  isLoggedIn: boolean;

  fetchUser: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loadingUser: true,
  isLoggedIn: false,

  fetchUser: async () => {
    try {
      const res = await fetch("/api/get-user", { credentials: "include" });

      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isLoggedIn: true });
      } else {
        set({ user: null, isLoggedIn: false });
      }
    } catch {
      set({ user: null, isLoggedIn: false });
    } finally {
      set({ loadingUser: false });
    }
  },

  updateUser: (updated) => {
    const current = get().user;
    if (!current) return;

    set({ user: { ...current, ...updated } });
  },

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  logout: async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        set({ user: null, isLoggedIn: false });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));

export const useUser = () => useAuthStore((s) => s.user);
export const useLoadingUser = () => useAuthStore((s) => s.loadingUser);
export const useIsLoggedIn = () => useAuthStore((s) => s.isLoggedIn);

export const useFetchUser = () => useAuthStore((s) => s.fetchUser);
export const useLogout = () => useAuthStore((s) => s.logout);
export const useSetUser = () => useAuthStore((s) => s.setUser);
export const useUpdateUser = () => useAuthStore((s) => s.updateUser);
