export interface AtributoSelecionado {
  nome: string;
  valor: string;
  preco: number;
  atributo_id: number;
  valor_atributo_id: number;
  preco_incluido: boolean;
}

export interface ProdutoCarrinho {
  /** Identifica a variação no carrinho (produto + atributos + observação). */
  itemId: string;
  id: number;
  nome: string;
  slug: string;
  imagem: string;
  quantidade: number;
  /** Preço unitário final, já com atributos (ver `domain/pricing`). */
  preco: number;
  observacoes?: string;
  atributos: AtributoSelecionado[];
}

export type NovoProdutoCarrinho = Omit<ProdutoCarrinho, "itemId">;
