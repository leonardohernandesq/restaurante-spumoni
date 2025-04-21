import { getAllProducts } from '@/services/produto';
import { create } from 'zustand';

export type TProduct = {
    categoria_id: number,
    nome: string,
    image_url: string,
    descricao: string,
    preco: number,
    ativo: number
}

export type TProductStore = {
    loading: boolean,
    product: TProduct | null,
    products: TProduct[],
}

export const productStore = create<TProductStore>((set) => ({
    loading: false,
    product: null,
    products: []
}))

