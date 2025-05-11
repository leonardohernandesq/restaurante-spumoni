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

export async function updateProduct(slug: string, data: FormData | IProduct) {
    const isFormData = data instanceof FormData;

    if (!isFormData) {
        (data as IProduct).slug = slug;
    }

    try {
        const response = await api.put(
            `/products/edit`,
            isFormData ? data : JSON.stringify(data),
            {
                headers: isFormData
                    ? { 'Content-Type': 'multipart/form-data' }
                    : { 'Content-Type': 'application/json' },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw new Error('Erro ao atualizar o produto');
    }
}


export async function deleteProduct({ id }: { id: string | number }) {
    const res = await api.delete('/products/delete', {
        data: { id }
    });

    return res.data;
}
