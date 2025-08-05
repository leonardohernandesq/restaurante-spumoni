import { api } from "@/config/api";
import { IProduct } from "@/interfaces/IProductAll";

export async function getAllProducts(all: number | null) {
    try {
        const res = await api.get(`/products${all ? `?all=${all}&_ts=${Date.now()}` : '?_ts=${Date.now()}'}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar todos os produtos:', error);
        throw new Error('Erro ao buscar todos os produtos');
    }
}


export async function getProductBySlug(slug: string) {
    try {
        const res = await api.get(`/product?slug=${slug}&_ts=${Date.now()}`);
        return res.data;
    } catch (error) {
        console.error(`Erro ao buscar produto com slug "${slug}":`, error);
        throw new Error('Erro ao buscar o produto');
    }
}

export async function addProduct(data: FormData | IProduct) {
    const isFormData = data instanceof FormData;

    try {
        const res = await api.post('/products', data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        });
        return res.data;
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        throw new Error('Erro ao adicionar produto');
    }
}

export async function updateProduct(slug: string, data: FormData | IProduct) {
    const isFormData = data instanceof FormData;

    if (!isFormData) {
        (data as IProduct).slug = slug;
    }

    try {
        const res = await api.put(
            '/products/edit',
            isFormData ? data : JSON.stringify(data),
            {
                headers: isFormData
                    ? { 'Content-Type': 'multipart/form-data' }
                    : { 'Content-Type': 'application/json' },
            }
        );

        return res.data;
    } catch (error) {
        console.error(`Erro ao atualizar produto com slug "${slug}":`, error);
        throw new Error('Erro ao atualizar o produto');
    }
}

export async function deleteProduct({ id }: { id: string | number }) {
    try {
        const res = await api.delete('/products/delete', {
            data: { id },
        });
        return res.data;
    } catch (error) {
        console.error(`Erro ao deletar produto com ID "${id}":`, error);
        throw new Error('Erro ao deletar o produto');
    }
}
