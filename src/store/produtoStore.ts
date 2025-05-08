import { create } from 'zustand';
import { addProduct, deleteProduct, getAllProducts, getProductBySlug, updateProduct } from '@/services/produto';
import { IProduct, IProductAll } from '@/interfaces/IProductAll';

export type TProductStore = {
    loading: boolean;
    product: IProduct | null;
    products: IProduct[];
    addNewProduct: (data: FormData | IProduct) => Promise<void>;
    updateProduct: (slug: string, data: FormData) => Promise<void>;
    getProductBySlug: (slug: string) => Promise<IProduct>;
    deleteProductApi: (id: string | number) => Promise<void>;
    fetchProducts: (all: number | null) => Promise<void>;
};

export const productStore = create<TProductStore>((set) => ({
    loading: false,
    product: null,
    products: [],

    addNewProduct: async (data: FormData | IProduct) => {
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

    updateProduct: async (slug: string, data: FormData) => {
        set({ loading: true });

        try {
            const response = await updateProduct(slug, data);
            set((state) => ({
                products: state.products.map((prod) =>
                    prod.slug === slug ? response : prod
                ),
                product: response,
                loading: false
            }));
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            set({ loading: false });
        }
    },

    getProductBySlug: async (slug: string) => {
        set({ loading: true });

        try {
            const product = await getProductBySlug(slug);
            set({ product, loading: false });
            return product;
        } catch (error) {
            console.error("Erro ao buscar produto por slug:", error);
            set({ loading: false });
            throw error;
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

    fetchProducts: async (all: number | null) => {
        set({ loading: true });

        try {
            const result = await getAllProducts(all);

            const flatProducts = result.flatMap((cat: IProductAll) =>
                cat.products.map((product) => ({
                    ...product,
                    categoria_id: cat.id
                }))
            );

            set({ products: flatProducts, loading: false });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            set({ loading: false });
        }
    }
}));
