import { api } from "@/config/api";
import type { OpeningHour, Settings } from "@/types/config";

export interface StatusLoja {
  aberta: boolean;
}

export const configService = {
  /** A API devolve um array com um único registro; normalizamos aqui. */
  async buscarConfiguracoes(): Promise<Settings | null> {
    const { data } = await api.get<Settings[] | Settings>("/config/settings");
    if (Array.isArray(data)) return data[0] ?? null;
    return data ?? null;
  },

  async salvarConfiguracoes(settings: Settings): Promise<unknown> {
    const { data } = await api.post("/config/settings", settings);
    return data;
  },

  async listarHorarios(): Promise<OpeningHour[]> {
    const { data } = await api.get<OpeningHour[]>("/config/opening_hours");
    return data ?? [];
  },

  async criarHorario(horario: OpeningHour): Promise<unknown> {
    const { data } = await api.post("/config/opening_hours", horario);
    return data;
  },

  /** Remove o horário de um dia (1 = segunda … 7 = domingo): a loja fica fechada nele. */
  async removerHorario(diaSemana: number): Promise<unknown> {
    const { data } = await api.delete("/config/opening_hours/delete", {
      data: { dia_semana: diaSemana },
    });
    return data;
  },

  async statusLoja(): Promise<StatusLoja> {
    const { data } = await api.get<StatusLoja>("/config/status");
    return data;
  },
};
