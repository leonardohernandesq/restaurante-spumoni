import { useEffect } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Estatisticas } from "@/domain/estatisticas";
import type { PeriodoComparado, TipoPeriodo } from "@/domain/periodo";

export interface FiltroEstatisticas {
  periodo: TipoPeriodo;
  de?: string;
  ate?: string;
  somenteFinalizados: boolean;
}

export interface RespostaEstatisticas {
  periodo: PeriodoComparado;
  estatisticas: Estatisticas;
  geradoEm: string;
}

/** Erro da rota do Next, com o motivo para a tela decidir o que mostrar. */
export class ErroEstatisticas extends Error {
  constructor(
    public status: number,
    public motivo: "senha" | "login" | "config" | "periodo" | "api" | "outro",
    message: string,
  ) {
    super(message);
  }
}

const chave = (f: FiltroEstatisticas) => ["estatisticas", f] as const;

// As rotas ficam no próprio Next (/api/estatisticas), não na API PHP
const buscar = async (f: FiltroEstatisticas): Promise<RespostaEstatisticas> => {
  const params = new URLSearchParams({ periodo: f.periodo });
  if (f.periodo === "personalizado" && f.de && f.ate) {
    params.set("de", f.de);
    params.set("ate", f.ate);
  }
  if (f.somenteFinalizados) params.set("finalizados", "1");

  const res = await fetch(`/api/estatisticas?${params}`, { credentials: "same-origin" });
  const corpo = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ErroEstatisticas(res.status, corpo.motivo ?? "outro", corpo.message ?? "Erro ao carregar.");
  }
  return corpo as RespostaEstatisticas;
};

export const useEstatisticasQuery = (filtro: FiltroEstatisticas, habilitado = true) =>
  useQuery({
    queryKey: chave(filtro),
    queryFn: () => buscar(filtro),
    enabled: habilitado,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
    // Senha/login/período errado: repetir não adianta
    retry: (n, erro) => erro instanceof ErroEstatisticas && erro.motivo === "api" && n < 1,
  });

const chamarSessao = async (metodo: "POST" | "DELETE", senha?: string) => {
  const res = await fetch("/api/estatisticas/sessao", {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: senha !== undefined ? JSON.stringify({ senha }) : undefined,
    credentials: "same-origin",
  });
  const corpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(corpo.message ?? "Não foi possível continuar.");
};

let bloqueioPendente: ReturnType<typeof setTimeout> | undefined;

/**
 * Bloqueia de novo ao sair da página (outra tela do admin, recarregar ou
 * fechar a aba): a senha vale só enquanto as estatísticas estão abertas.
 */
export const useBloquearAoSair = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Em dev o React monta, desmonta e monta de novo: cancela o bloqueio agendado
    clearTimeout(bloqueioPendente);

    const bloquear = () => {
      queryClient.removeQueries({ queryKey: ["estatisticas"] });
      // keepalive: a requisição termina mesmo com a página saindo
      fetch("/api/estatisticas/sessao", {
        method: "DELETE",
        credentials: "same-origin",
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener("pagehide", bloquear);
    return () => {
      window.removeEventListener("pagehide", bloquear);
      bloqueioPendente = setTimeout(bloquear, 0);
    };
  }, [queryClient]);
};

/** Abre (senha) ou fecha a sessão; em ambos os casos descarta os números do cache. */
export const useSessaoEstatisticas = () => {
  const queryClient = useQueryClient();
  const limpar = () => queryClient.removeQueries({ queryKey: ["estatisticas"] });

  return {
    entrar: useMutation({
      mutationFn: (senha: string) => chamarSessao("POST", senha),
      onSuccess: limpar,
    }),
    bloquear: useMutation({
      mutationFn: () => chamarSessao("DELETE"),
      onSettled: limpar,
    }),
  };
};
