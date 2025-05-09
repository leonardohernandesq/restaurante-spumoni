import { createCategory, getAllCategory } from '@/services/category';
import { create } from 'zustand';

export type TCategory = {
    id: number;
    nome: string;
    slug: string;
    descricao: string;
}

export type TcategoryStore = {
    loading: boolean;
    error: true | null;
    category: TCategory | null;
    categories: TCategory[];
    create: ({ nome, slug, descricao }: TCategory) => Promise<void>;
    getAll: () => Promise<void>;

}

export const categoryStore = create<TcategoryStore>((set) => ({
    category: null,
    categories: [],
    loading: false,
    error: null,
    create: async ({ nome, slug, descricao }: TCategory) => {
        set({ loading: true, error: null });
        try {
            const category = await createCategory({ nome, slug, descricao } as TCategory);
            set({ category });
        } finally {
            set({ loading: false });
        }
    },
    getAll: async () => {
        const fetchedCategories: TCategory[] = await getAllCategory();
        set({ categories: fetchedCategories })
    }
}))

