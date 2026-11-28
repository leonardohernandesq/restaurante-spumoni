import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

/**
 * Produtos e categorias aparecem juntos no cardápio (e a categoria mostra
 * `total_produtos`): qualquer mudança em um invalida os dois.
 */
export const useInvalidarCardapio = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.produtos.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.categorias.all }),
    ]);
};
