import { loginUser, logoutUser } from '@/services/auth';
import { create } from 'zustand';

export type TUser = {
    id: string;
    name: string;
    email: string;
    senha: string;
}

export type TuserStore = {
    loading: boolean;
    error: true | null;
    user: TUser | null;
    setUser: (user: TUser) => void;
    clearUser: () => void;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export const userStore = create<TuserStore>((set) => ({
    user: null,
    loading: false,
    error: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    login: async (email, senha) => {
        set({ loading: true, error: null });
        try {
            const user = await loginUser({ email, senha } as TUser);
            set({ user });
        } finally {
            set({ loading: false });
        }
    },
    logout: async () => {
        set({ loading: true });
        try {
            await logoutUser();
            set({ user: null });
        } catch (error) {
            console.error('Erro ao fazer logout', error);
        } finally {
            set({ loading: false });
        }
    }
}))

