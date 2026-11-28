export interface Categoria {
  id: number;
  nome?: string;
  slug?: string;
  descricao?: string;
  /** Quantidade de produtos da categoria, ativos ou não (vem da listagem). */
  total_produtos?: number;
}

/** Corpo para criar uma categoria (o id vem do servidor). */
export type CategoriaCreateDto = Required<Pick<Categoria, "nome" | "slug" | "descricao">>;

export interface CategoriaUpdateDto extends Categoria {
  id: number;
}
