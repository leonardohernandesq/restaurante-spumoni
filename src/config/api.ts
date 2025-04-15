import axios from 'axios';

const api = axios.create({
    baseURL: process.env.PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);