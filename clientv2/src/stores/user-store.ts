import { IUser } from "@/interfaces/user.interface";
import { create } from "zustand";
export interface userState {
    user: IUser | null;
    setUser: (user: IUser) => void;
    isAuthenticated: boolean | null;
    clearUser: () => void;
}

export const useUserStore = create<userState>((set, get) => ({
    user: null,
    setUser: (user: IUser) => set({ user, isAuthenticated: true }),
    isAuthenticated: null ,
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));