/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPedidoCreate } from "@/interfaces/IPedidoCreate";
import { CheckoutFormData } from "@/interfaces/ICheckoutForm";

export const mapPedidoData = ({
  data,
  produtos,
  enderecoHook,
  taxaEntrega,
}: {
  data: CheckoutFormData;
  produtos: any[];
  enderecoHook: any;
  taxaEntrega: number;
}): IPedidoCreate => ({
  nome_cliente: data.nome_cliente,
  telefone: data.telefone,
  tipo_entrega: data.tipo_entrega,
  entrega: data.entrega,
  data_entrega: data.data_entrega || undefined,
  forma_pagamento: data.forma_pagamento,
  troco: data.troco || undefined,
  nota_fiscal: data.nota_fiscal || undefined,
  data_pedido: new Date().toISOString(),
  produtos,

  ...(data.tipo_entrega === "delivery" && {
    taxa_entrega: taxaEntrega || undefined,
    endereco_entrega: enderecoHook.modalEndereco || undefined,
    bairro: enderecoHook.modalBairro || undefined,
    numero: enderecoHook.modalNumero || undefined,
    complemento: enderecoHook.modalComplemento || undefined,
    cep: enderecoHook.cep || undefined,
    referencia: enderecoHook.modalReferencia || undefined,
  }),
});
