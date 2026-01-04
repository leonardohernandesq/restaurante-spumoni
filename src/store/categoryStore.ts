import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "@/services/category";
import { create } from "zustand";

export type TCategory = {
  id: number;
  nome?: string;
  slug?: string;
  descricao?: string;
};

export type TcategoryStore = {
  loading: boolean;
  error: true | string | null;
  category: TCategory | null;
  categories: TCategory[];
  create: ({ nome, slug, descricao }: TCategory) => Promise<void>;
  getAll: () => Promise<void>;
  getCatById: ({ id }: { id: number }) => Promise<void>;
  delete: ({ id }: { id: number }) => Promise<void>;
  update: ({ id, nome, slug, descricao }: TCategory) => Promise<void>;
  setCategory: (newData: Partial<TCategory>) => void;
};

export const categoryStore = create<TcategoryStore>((set) => ({
  category: null,
  setCategory: (newData: Partial<TCategory>) =>
    set((state) => ({
      category: {
        ...state.category,
        ...newData,
      } as TCategory,
    })),
  categories: [],
  loading: true,
  error: null,
  create: async ({ nome, slug, descricao }: TCategory) => {
    set({ loading: true, error: null });
    try {
      const category = await createCategory({
        nome,
        slug,
        descricao,
      } as TCategory);
      set({ category });
    } finally {
      set({ loading: false });
    }
  },
  getAll: async () => {
    try {
      const fetchedCategories: TCategory[] = await getAllCategory();
      set({ categories: fetchedCategories });
    } finally {
      set({ loading: false });
    }
  },
  getCatById: async ({ id }) => {
    set({ loading: true, error: null });
    try {
      const fetchedCategory: TCategory = await getCategoryById({ id });
      set({ category: fetchedCategory });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  delete: async ({ id }: { id: number }) => {
    await deleteCategory({ id });
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },
  update: async ({ id, nome, slug, descricao }: TCategory) => {
    const updated = await updateCategory({ id, nome, slug, descricao });

    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updated.data } : category
      ),
    }));
  },
}));
