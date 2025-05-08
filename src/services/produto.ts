import { api } from "@/config/api";
import { IProduct } from "@/interfaces/IProductAll";

export async function getAllProducts(all: number | null) {
    const res = await api.get(`/products${all ? `?all=${all}` : ''}`);

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

export const updateProduct = async (slug: string, formData: FormData) => {
    try {
        const response = await api.put(`/products/edit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw new Error('Erro ao atualizar o produto');
    }
};
