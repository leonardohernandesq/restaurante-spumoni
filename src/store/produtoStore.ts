import { create } from 'zustand';
import { addProduct, deleteProduct, getAllProducts, getProductBySlug, updateProduct as updateProductAPI } from '@/services/produto';
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

    addNewProduct: async (data) => {
        set({ loading: true });
        try {
            await addProduct(data);
            await productStore.getState().fetchProducts(null); // força atualização
            set({ loading: false });
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
            set({ loading: false });
        }
    },


    updateProduct: async (slug, data) => {
        set({ loading: true });
        try {
            await updateProductAPI(slug, data);
            await productStore.getState().fetchProducts(null); // força atualização
            set({ loading: false });
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            set({ loading: false });
        }
    },


    getProductBySlug: async (slug: string) => {
        set({ loading: true });

        try {
            const product = await getProductBySlug(slug);

            console.log("📦 Produto obtido:", product);
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
                products: state.products.filter(p => p.id !== id)
            }));
            set({ loading: false });
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
                (cat.products ?? [])
                    .filter((product) => !!product?.id)
                    .map((product) => ({
                        ...product,
                        categoria_id: cat.id,
                    }))
            );

            console.log('Produtos recebidos da API:', result);
            console.log('Produtos formatados:', flatProducts);


            set({ products: flatProducts, loading: false });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            set({ loading: false });
        }
    }
}));
