import { useMutation, useQuery } from "@tanstack/react-query";
import { achatarProdutos, produtoService } from "@/services/produto";
import type { Produto } from "@/types/produto";
import { useInvalidarCardapio } from "./cardapio";
import { queryKeys } from "./keys";

/**
 * Lista plana de produtos (cada um com `categoria_id`).
 * `incluirInativos` = lista do admin. `initialData` = buscado no servidor.
 */
export const useProdutosQuery = (
  incluirInativos = false,
  initialData?: Produto[],
) =>
  useQuery({
    queryKey: queryKeys.produtos.list(incluirInativos),
    queryFn: async () =>
      achatarProdutos(await produtoService.listarCardapio(incluirInativos)),
    initialData,
  });

export const useProdutoQuery = (slug?: string) =>
  useQuery({
    queryKey: queryKeys.produtos.detail(slug ?? ""),
    queryFn: () => produtoService.buscar(slug as string),
    enabled: !!slug,
  });

/** Cria (sem slug) ou edita (com slug) um produto. */
export const useSaveProduto = () => {
  const invalidar = useInvalidarCardapio();
  return useMutation({
    mutationFn: ({ slug, form }: { slug?: string; form: FormData }) =>
      slug ? produtoService.atualizar(slug, form) : produtoService.criar(form),
    onSuccess: invalidar,
  });
};

export const useAlternarProdutoAtivo = () => {
  const invalidar = useInvalidarCardapio();
  return useMutation({
    mutationFn: (id: string | number) => produtoService.alternarAtivo(id),
    onSuccess: invalidar,
  });
};

export const useDeleteProduto = () => {
  const invalidar = useInvalidarCardapio();
  return useMutation({
    mutationFn: (id: string | number) => produtoService.remover(id),
    onSuccess: invalidar,
  });
};
