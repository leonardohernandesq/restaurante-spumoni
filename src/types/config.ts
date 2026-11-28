/** Configurações gerais da loja (`/config/settings`). */
export interface Settings {
  /** "0" ou "1" — loja fechada manualmente pelo admin. */
  fechado_manual: string;
  mensagem_rodape: string;
  facebook_url: string;
  instagram_url: string;
  whatsapp_number: string;
  phone_number: string;
  address: string;
  /** Largura do papel da impressora térmica (ex.: "86mm"). */
  tamanho_bobina: string;

  address_delivery?: {
    bairro: string;
    valor_entrega: string;
  }[];
}

/** Horário de funcionamento de um dia da semana (`/config/opening_hours`). */
export interface OpeningHour {
  id?: number;
  horario_abertura: string; // "09:30:00"
  horario_fechamento: string; // "15:30:00"
  /** 1 = segunda … 7 = domingo (vem como string da API). */
  dia_semana: string;
  observacao: string;
}
