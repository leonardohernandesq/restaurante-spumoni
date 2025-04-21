import { TCategory } from '@/store/categoryStore';
import { api } from '@/config/api'

export async function createCategory({ nome, slug, descricao }: TCategory) {
    const res = await api.post('/category/create', { nome, slug, descricao });

    return res.data;
}

export async function getAllCategory() {
    const res = await api.get('/category');

    return res.data;
}
