"use client";

import { create } from "zustand";
import { User } from "@/types/user";

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    clearAuthState: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => {
        set({ user, isAuthenticated: !!user });
    },
    clearAuthState: () => {
        set({ user: null, isAuthenticated: false });
    },
}));
