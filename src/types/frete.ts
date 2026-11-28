/** Frete por bairro. `preco` fica como string porque é editado em input no admin. */
export interface Frete {
  id?: number;
  bairro: string;
  preco: string;
  cidade: string;
}

export interface FretePagination {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface FreteApiResponse {
  data: Frete[];
  pagination: FretePagination;
}
