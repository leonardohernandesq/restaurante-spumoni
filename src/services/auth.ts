import { TUser } from '@/store/userStore';
import { api } from '@/config/api'

export async function loginUser({ email, senha }: TUser) {
    const res = await api.post('/users/login', { email, senha });

    return res.data;
}

export async function logoutUser() {
    const res = await api.post('/users/logout');

    return res.data;
}