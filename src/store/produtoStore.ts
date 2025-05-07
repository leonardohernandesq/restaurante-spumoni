import { create } from 'zustand';
import { addProduct, deleteProduct, getAllProducts } from '@/services/produto';
import { IProduct, IProductAll } from '@/interfaces/IProductAll';

export type TProductStore = {
    loading: boolean;
    product: IProduct | null;
    products: IProduct[];
    addNewProduct: (data: IProduct) => Promise<void>;
    deleteProductApi: (id: string | number) => Promise<void>;
    fetchProducts: () => Promise<void>;
};

export const productStore = create<TProductStore>((set) => ({
    loading: false,
    product: null,
    products: [],

    addNewProduct: async (data: IProduct) => {
        set({ loading: true });

        try {
            const response = await addProduct(data);
            set((state) => ({
                products: [...state.products, response],
                product: response,
                loading: false
            }));
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
            set({ loading: false });
        }
    },

    deleteProductApi: async (id: string | number) => {
        set({ loading: true });

        try {
            await deleteProduct({ id });
            set((state) => ({
                products: state.products.filter((prev) => prev.id !== id),
                loading: false
            }));
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            set({ loading: false });
        }
    },

    fetchProducts: async () => {
        set({ loading: true });

        try {
            const result = await getAllProducts();

            const flatProducts = result.flatMap((cat: IProductAll) =>
                cat.products.map((product) => ({
                    ...product,
                    categoria_id: cat.id // ✅ agora é um número e corresponde a categoria.id
                }))
            );

            set({ products: flatProducts, loading: false });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            set({ loading: false });
        }
    }

}));
