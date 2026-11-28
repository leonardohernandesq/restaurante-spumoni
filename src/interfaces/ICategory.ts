import type { Categoria } from "@/types/categoria";

export interface IPropsCategory {
  categories: Categoria[];
  isLoading?: boolean;
}
