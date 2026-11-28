import { useMutation, useQuery } from "@tanstack/react-query";
import { categoriaService } from "@/services/category";
import type {
  Categoria,
  CategoriaCreateDto,
  CategoriaUpdateDto,
} from "@/types/categoria";
import { useInvalidarCardapio } from "./cardapio";
import { queryKeys } from "./keys";

/** `initialData`: lista já buscada no servidor (home), evita o 1º fetch. */
export const useCategoriasQuery = (initialData?: Categoria[]) =>
  useQuery({
    queryKey: queryKeys.categorias.list,
    queryFn: categoriaService.listar,
    initialData,
  });

export const useCategoriaQuery = (id: number) =>
  useQuery({
    queryKey: queryKeys.categorias.detail(id),
    queryFn: () => categoriaService.buscar(id),
    enabled: Number.isInteger(id) && id > 0,
  });

export const useCreateCategoria = () => {
  const invalidar = useInvalidarCardapio();
  return useMutation({
    mutationFn: (dados: CategoriaCreateDto) => categoriaService.criar(dados),
    onSuccess: invalidar,
  });
};

export const useUpdateCategoria = () => {
  const invalidar = useInvalidarCardapio();
  return useMutation({
    mutationFn: (dados: CategoriaUpdateDto) => categoriaService.atualizar(dados),
    onSuccess: invalidar,
  });
};

export const useDeleteCategoria = () => {
  const invalidar = useInvalidarCardapio();
  return useMutation({
    mutationFn: (id: number) => categoriaService.remover(id),
    onSuccess: invalidar,
  });
};
