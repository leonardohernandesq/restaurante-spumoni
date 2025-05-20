import { api } from "@/config/api";

export const configService = {
    async getSettings() {
        const { data } = await api.get('/config/settings');
        return data;
    },

    async updateSettings(payload: any) {
        return await api.post('/config/settings', payload);
    },

    async getOpeningHours() {
        const { data } = await api.get('/config/opening_hours');
        return data;
    },

    async createOpeningHour(payload: any) {
        return await api.post('/config/opening_hours', payload);
    },

    async updateOpeningHour(id: number, payload: any) {
        return await api.put(`/config/opening_hours/${id}`, payload);
    },

    async getStatusLoja() {
        return await api.get('/config/status');
    }
}
