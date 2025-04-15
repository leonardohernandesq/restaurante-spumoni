import { create } from 'zustand';

type TUser = {
    id: string;
    name: string;
    email: string;
}

type TuserStore = {
    user: TUser | null;
    setUser: (user: TUser) => void;
    clearUser: () => void;
}

export const userStore = create<TuserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}))