export interface CheckoutFormData {
  // Dados do cliente
  nome_cliente: string;
  telefone: string;

  // Tipo de entrega
  tipo_entrega: "delivery" | "takeaway";
  entrega: "booking" | "now";
  data_entrega?: string;

  // Dados de endereço (apenas para delivery)
  endereco_entrega?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  referencia?: string;

  // Pagamento
  forma_pagamento: string;
  troco?: string;
  nota_fiscal?: string;
}
