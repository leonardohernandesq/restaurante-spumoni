import { create } from 'zustand';
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct as updateProductAPI
} from '@/services/produto';

import { IProduct, IProductAll } from '@/interfaces/IProductAll';

export type TProductStore = {
    loading: boolean;
    product: IProduct | null;
    products: IProduct[];
    addNewProduct: (data: FormData | IProduct) => Promise<void>;
    updateProduct: (slug: string, data: FormData | IProduct) => Promise<void>;
    getProductBySlug: (slug: string) => Promise<IProduct>;
    deleteProductApi: (id: string | number) => Promise<void>;
    fetchProducts: (all: number | null, bustCache?: boolean) => Promise<void>;
};

export const productStore = create<TProductStore>((set) => ({
    loading: false,
    product: null,
    products: [],

    fetchProducts: async (all: number | null, bustCache = false) => {
        set({ loading: true });
        try {
            const result = await getAllProducts(all, bustCache);
            const flatProducts = result.flatMap((cat: IProductAll) =>
                (cat.products ?? [])
                    .filter((product) => !!product?.id)
                    .map((product) => ({
                        ...product,
                        categoria_id: cat.id,
                    }))
            );

            console.log('Produtos recebidos da API:', result);
            console.log('Produtos formatados:', flatProducts);

            set({ products: flatProducts });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            set({ loading: false });
        }
    },

    addNewProduct: async (data) => {
        set({ loading: true });
        try {
            const response = await addProduct(data);
            set({ product: response });
            await productStore.getState().fetchProducts(null, true); // bust cache
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (slug, data) => {
        set({ loading: true });
        try {
            const response = await updateProductAPI(slug, data);
            set({ product: response });
            await productStore.getState().fetchProducts(null, true); // bust cache
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        } finally {
            set({ loading: false });
        }
    },

    deleteProductApi: async (id) => {
        set({ loading: true });
        try {
            await deleteProduct({ id });
            await productStore.getState().fetchProducts(null, true); // bust cache
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
        } finally {
            set({ loading: false });
        }
    },

    getProductBySlug: async (slug) => {
        set({ loading: true });
        try {
            const product = await getProductBySlug(slug, true); // garante fetch atualizado
            console.log('📦 Produto obtido:', product);
            set({ product });
            return product;
        } catch (error) {
            console.error('Erro ao buscar produto por slug:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));
