import { create } from 'zustand'
import { configService } from '@/services/config'

interface Settings {
    fechado_manual: string;
    mensagem_rodape: string;
    facebook_url: string;
    instagram_url: string;
    whatsapp_number: string;
    phone_number: string;
    address: string;
    tamanho_bobina: string;
}

interface OpeningHour {
    id?: number;
    horario_abertura: string;
    horario_fechamento: string;
    dia_semana: string;
    observacao: string;
}

interface ConfigStore {
    settings: Settings;
    openingHours: OpeningHour[];
    setOpeningHours: (data: OpeningHour[]) => void;
    setSettings: (data: Partial<Settings>) => void;
    fetchSettings: () => Promise<void>;
    updateSettings: (data: Settings) => Promise<void>;
    fetchOpeningHours: () => Promise<void>;
    createOpeningHour: (data: OpeningHour) => Promise<void>;
    updateOpeningHour: (id: number, data: OpeningHour) => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set) => ({
    settings: {
        fechado_manual: '0',
        mensagem_rodape: '',
        facebook_url: '',
        instagram_url: '',
        whatsapp_number: '',
        phone_number: '',
        address: '',
        tamanho_bobina: ''
    },
    setSettings: (data: any) => set((state) => ({
        settings: { ...state.settings, ...data }
    })),
    openingHours: [],
    setOpeningHours: (data: OpeningHour[]) => set({ openingHours: data }),
    fetchSettings: async () => {
        const response = await configService.getSettings();
        if (Array.isArray(response) && response.length > 0) {
            set({ settings: response[0] });
        }
    },

    updateSettings: async (data) => {
        await configService.updateSettings(data);
        set({ settings: data });
    },

    fetchOpeningHours: async () => {
        const data = await configService.getOpeningHours();
        set({ openingHours: data });
    },

    createOpeningHour: async (data) => {
        await configService.createOpeningHour(data);
    },

    updateOpeningHour: async (id, data) => {
        await configService.updateOpeningHour(id, data);
    }
}));
