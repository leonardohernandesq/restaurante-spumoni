/** Valor de um atributo (ex.: Tamanho → "Média", R$ 24). */
export interface ProdutoValorAtributo {
  valor_atributo_id?: number;
  valor: string;
  preco: string;
  /** true = o preço do atributo SUBSTITUI o preço base (ver domain/pricing). */
  preco_incluido: boolean;
}

export interface ProdutoAtributo {
  atributo_id?: number;
  limite: number | null;
  obrigatorio: boolean | string | number;
  nome_atributo: string;
  valores_atributo: ProdutoValorAtributo[];
}

/**
 * Produto como a API devolve. A API mistura nomes em português e inglês
 * (`preco`/`price`, `ativo`/`active`...) dependendo da rota.
 */
export interface Produto {
  image_url: string;
  id: number;
  name: string;
  slug: string;
  descricao?: string;
  description?: string;
  image: string;
  preco?: string | number;
  price?: string | number;
  categoria_id: number;
  ativo: boolean;
  active: boolean;
  atributos: ProdutoAtributo[];
  dias_disponiveis: number[];
  available_days: number[];
}

/** Categoria com os produtos dela (formato de GET /products e do cardápio). */
export interface CategoriaComProdutos {
  id: string;
  category: string;
  slug?: string;
  descriptionCategory: string;
  products: Produto[];
}
