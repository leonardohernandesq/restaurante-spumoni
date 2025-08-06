import { TCategory } from '@/store/categoryStore';
import { api } from '@/config/api'

export async function createCategory({ nome, slug, descricao }: TCategory) {
    const res = await api.post('/category/create', { nome, slug, descricao });

    return res.data;
}

export async function getAllCategory() {
    const res = await api.get('/category', {
        params: {
            _t: Date.now()
        },
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });

    return res.data;
}


export async function getCategoryById({ id }: { id: number }) {
    const res = await api.get(`/categoryId`, {
        params: {
            id,
            _t: Date.now() // quebra cache
        },
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });

    return res.data;
}

export async function deleteCategory({ id }: { id: number }) {
    const res = await api.delete('/category/delete', { data: { id } });

    return res.data;
}

export async function updateCategory({ id, nome, slug, descricao }: TCategory) {
    const res = await api.put('/category/edit', { id, nome, slug, descricao });

    return res.data;
}
