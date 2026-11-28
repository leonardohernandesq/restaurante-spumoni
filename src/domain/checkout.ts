import type { MomentoEntrega, PedidoCreateDto, TipoEntrega } from "@/types/pedido";
import type { ProdutoCarrinho } from "@/types/carrinho";

/** Endereço de entrega digitado pelo cliente. */
export interface EnderecoEntrega {
  rua: string;
  numero: string;
  complemento: string;
  cep: string;
  cidade: string;
  bairro: string;
  referencia: string;
}

/** Valores do formulário de checkout (`/finalizar`). */
export interface CheckoutForm {
  nome: string;
  telefone: string;
  tipoEntrega: TipoEntrega;
  entrega: MomentoEntrega;
  dataEntrega: string;
  formaPagamento: string;
  troco: string;
  notaFiscal: string;
  endereco: EnderecoEntrega;
}

export const enderecoVazio = (): EnderecoEntrega => ({
  rua: "",
  numero: "",
  complemento: "",
  cep: "",
  cidade: "",
  bairro: "",
  referencia: "",
});

export const checkoutVazio = (): CheckoutForm => ({
  nome: "",
  telefone: "",
  tipoEntrega: "delivery",
  entrega: "now",
  dataEntrega: "",
  formaPagamento: "pix",
  troco: "",
  notaFiscal: "",
  endereco: enderecoVazio(),
});

/** "01234567" → "01234-567" (aceita entrada parcial). */
export const formatarCep = (valor: string): string => {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  return digitos.length <= 5
    ? digitos
    : `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
};

/** Campos obrigatórios do endereço: rua, número, CEP, cidade e bairro. */
export const isEnderecoCompleto = (e: EnderecoEntrega): boolean =>
  Boolean(e.rua && e.numero && e.cep && e.cidade && e.bairro);

/** Texto do endereço para mostrar na tela (vazio se incompleto). */
export const descreverEndereco = (e: EnderecoEntrega): string => {
  if (!isEnderecoCompleto(e)) return "";

  const linha = [e.rua, e.numero, e.complemento, e.cidade, e.bairro, e.cep]
    .filter(Boolean)
    .join(", ");

  return e.referencia ? `${linha} | ${e.referencia}` : linha;
};

export type CampoCheckout = "endereco" | "nome" | "telefone";

/**
 * WhatsApp com DDD: (DD) 99999-9999 (celular, 11 dígitos começando em 9)
 * ou (DD) 9999-9999 (10 dígitos). Aceita o número com ou sem máscara.
 */
export const isTelefoneValido = (telefone: string): boolean => {
  const digitos = telefone.replace(/\D/g, "");
  if (!/^[1-9][1-9]/.test(digitos)) return false; // DDD não tem 0
  if (digitos.length === 11) return digitos[2] === "9";
  return digitos.length === 10;
};

export const MENSAGEM_TELEFONE_INVALIDO =
  "Informe o WhatsApp com DDD: (11) 99999-9999 ou (11) 9999-9999.";

export interface ErroCheckout {
  campo: CampoCheckout;
  mensagem: string;
}

/** Validação do checkout. Devolve o primeiro erro, ou `null` se estiver ok. */
export const validarCheckout = (form: CheckoutForm): ErroCheckout | null => {
  if (form.tipoEntrega === "delivery" && !isEnderecoCompleto(form.endereco)) {
    return {
      campo: "endereco",
      mensagem: "Por favor, insira um endereço válido para entrega.",
    };
  }

  if (!form.nome.trim()) {
    return {
      campo: "nome",
      mensagem: "Preencha todos os campos necessários para pedir",
    };
  }

  if (!form.telefone) {
    return {
      campo: "telefone",
      mensagem: "Preencha todos os campos necessários para pedir",
    };
  }

  if (!isTelefoneValido(form.telefone)) {
    return { campo: "telefone", mensagem: MENSAGEM_TELEFONE_INVALIDO };
  }

  return null;
};

/** Monta o corpo do POST de pedido a partir do formulário e do carrinho. */
export const montarPedidoDto = (
  form: CheckoutForm,
  produtos: ProdutoCarrinho[],
  taxaEntrega: number,
  dataPedido: string,
): PedidoCreateDto => {
  const dto: PedidoCreateDto = {
    nome_cliente: form.nome.trim(),
    telefone: form.telefone,
    tipo_entrega: form.tipoEntrega,
    entrega: form.entrega,
    data_entrega:
      form.entrega === "booking" && form.dataEntrega
        ? form.dataEntrega
        : undefined,
    forma_pagamento: form.formaPagamento,
    troco:
      form.formaPagamento === "dinheiro" && form.troco ? form.troco : undefined,
    nota_fiscal: form.notaFiscal || undefined,
    data_pedido: dataPedido,
    produtos: produtos.map((produto) => ({
      produto_id: produto.id,
      quantidade: produto.quantidade,
      observacao: produto.observacoes || "",
      atributos: produto.atributos.map((attr) => ({
        atributo_id: attr.atributo_id ?? null,
        valor_atributo_id: attr.valor_atributo_id ?? null,
        preco_incluido: attr.preco_incluido,
      })),
    })),
  };

  if (form.tipoEntrega === "delivery") {
    const e = form.endereco;
    Object.assign(dto, {
      taxa_entrega: taxaEntrega || undefined,
      endereco_entrega: e.rua || undefined,
      bairro: e.bairro || undefined,
      numero: e.numero || undefined,
      complemento: e.complemento || undefined,
      cep: e.cep || undefined,
      referencia: e.referencia || undefined,
    });
  }

  return dto;
};
