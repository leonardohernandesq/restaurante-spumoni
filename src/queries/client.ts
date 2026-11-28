import { QueryClient } from "@tanstack/react-query";

const statusDoErro = (error: unknown): number | undefined =>
  (error as { response?: { status?: number } })?.response?.status;

/** Erros que não adianta repetir (sem login, sem permissão, não existe). */
const SEM_RETRY = new Set([400, 401, 403, 404]);

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (tentativas, error) =>
          !SEM_RETRY.has(statusDoErro(error) ?? 0) && tentativas < 1,
      },
      mutations: {
        retry: false,
      },
    },
  });
