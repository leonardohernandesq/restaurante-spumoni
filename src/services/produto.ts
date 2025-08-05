import { api } from "@/config/api";
import { IProduct } from "@/interfaces/IProductAll";

// Helper para saber se estamos no browser
const isBrowser = typeof window !== 'undefined';

export async function getAllProducts(all: number | null, bustCache = false) {
    try {
        const params = new URLSearchParams();

        if (all !== null) params.append('all', all.toString());

        // Só adiciona timestamp se for client e solicitado
        if (bustCache && isBrowser) {
            params.append('_ts', Date.now().toString());
        }

        const query = params.toString();
        const url = `/products${query ? `?${query}` : ''}`;

        const res = await api.get(url);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar todos os produtos:', error);
        throw new Error('Erro ao buscar todos os produtos');
    }
}

export async function getProductBySlug(slug: string, bustCache = false) {
    try {
        const params = new URLSearchParams();
        params.append('slug', slug);

        if (bustCache && isBrowser) {
            params.append('_ts', Date.now().toString());
        }

        const url = `/product?${params.toString()}`;

        const res = await api.get(url);
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
