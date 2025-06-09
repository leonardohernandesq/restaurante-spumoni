import { api } from "@/config/api";
import { OpeningHour, Settings } from "@/store/configStore";

export const configService = {
    async getSettings(): Promise<Settings> {
        const { data } = await api.get('/config/settings');
        return data;
    },

    updateSettings(payload: Settings) {
        return api.post('/config/settings', payload);
    },

    async getOpeningHours(): Promise<OpeningHour[]> {
        const { data } = await api.get('/config/opening_hours');
        return data;
    },

    createOpeningHour(payload: OpeningHour) {
        return api.post('/config/opening_hours', payload);
    },

    updateOpeningHour(id: number, payload: OpeningHour) {
        return api.put(`/config/opening_hours/${id}`, payload);
    },

    getStatusLoja() {
        return api.get('/config/status');
    }
}
