import { api } from "@/config/api";
import { IProduct } from "@/interfaces/IProductAll";

export async function getAllProducts() {
    const res = await api.get('/products');

    return res.data;
}

export async function getProductBySlug(slug: string) {
    const res = await api.get(`/product?slug=${slug}`);

    return res.data;
}

export async function addProduct(data: FormData | IProduct) {
    const isFormData = data instanceof FormData;

    const res = await api.post('/products', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });

    return res.data;
}
export async function deleteProduct({ id }: { id: string | number }) {
    const res = await api.delete('/products/delete', {
        data: { id }
    });

    return res.data;
}
