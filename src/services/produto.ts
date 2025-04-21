import { api } from "@/config/api";

export async function getAllProducts() {
    const res = await api.get('/products');

    return res.data;
}

export async function getProductBySlug(slug: string) {
    const res = await api.get(`/product?slug=${slug}`);

    return res.data
}