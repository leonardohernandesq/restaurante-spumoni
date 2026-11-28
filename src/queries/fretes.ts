import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { freteService } from "@/services/frete";
import type { Frete } from "@/types/frete";
import { queryKeys } from "./keys";

/**
 * Maior página que a API aceita: acima de 100 ela ignora o pedido e devolve
 * só 10 (o checkout chegou a mostrar apenas uma cidade por isso).
 */
const TODOS_PER_PAGE = 100;

/** Todos os fretes (checkout): percorre as páginas até acabar. Ver B4 no plano. */
export const useAllFretesQuery = () =>
  useQuery({
    queryKey: queryKeys.fretes.todos,
    queryFn: async () => {
      const primeira = await freteService.listar(1, TODOS_PER_PAGE);
      const totalPaginas = primeira.pagination?.totalPages ?? 1;
      const resto = await Promise.all(
        Array.from({ length: totalPaginas - 1 }, (_, i) =>
          freteService.listar(i + 2, TODOS_PER_PAGE),
        ),
      );
      return [primeira, ...resto].flatMap((p) => p.data);
    },
  });

/**
 * Mutations de frete. Invalidam a lista completa (checkout e admin). A tela
 * do admin só substitui o que está editando ao salvar, para não descartar
 * edições ainda não salvas em outras linhas.
 */
const useInvalidarTodosFretes = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.fretes.todos });
};

export const useCreateFrete = () => {
  const invalidar = useInvalidarTodosFretes();
  return useMutation({
    mutationFn: (frete: Frete) => freteService.criar(frete),
    onSuccess: invalidar,
  });
};

export const useUpdateFrete = () => {
  const invalidar = useInvalidarTodosFretes();
  return useMutation({
    mutationFn: ({ id, frete }: { id: number; frete: Frete }) =>
      freteService.atualizar(id, frete),
    onSuccess: invalidar,
  });
};

export const useDeleteFrete = () => {
  const invalidar = useInvalidarTodosFretes();
  return useMutation({
    mutationFn: (id: number) => freteService.remover(id),
    onSuccess: invalidar,
  });
};
