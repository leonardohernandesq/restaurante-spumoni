import type { Pedido, PedidoCreateDto } from "@/types/pedido";
import type { ProdutoCarrinho } from "@/types/carrinho";
import { formatCurrencyBRL } from "@/utils/format";
import { getFormaPagamentoLabel } from "./pedidoStatus";
import { toNumber } from "./pricing";

interface TotaisPedido {
  subtotal: number;
  taxaEntrega: number;
  valorFinal: number;
}

/**
 * Monta o resumo do pedido com os dados que o próprio cliente acabou de
 * preencher no checkout. A página /obrigado usa este resumo em vez de buscar
 * o pedido na API, que hoje devolve dados de qualquer pedido sem login
 * (ver item 1.2 / B1 no PLANO_REFATORACAO.md).
 *
 * Atenção: `preco_base` aqui é o preço unitário FINAL do carrinho (já com
 * atributos). O resumo é só para exibição; não recalcule preço a partir dele.
 */
export const montarResumoPedido = (
  pedidoId: number,
  dados: PedidoCreateDto,
  itens: ProdutoCarrinho[],
  totais: TotaisPedido,
): Pedido => ({
  id: pedidoId,
  nome_cliente: dados.nome_cliente,
  telefone: dados.telefone,
  tipo_entrega: dados.tipo_entrega,
  entrega: dados.entrega,
  data_entrega: dados.data_entrega,
  endereco_entrega: dados.endereco_entrega,
  bairro: dados.bairro,
  cep: dados.cep,
  numero: dados.numero,
  complemento: dados.complemento,
  referencia: dados.referencia,
  taxa_entrega: totais.taxaEntrega,
  total_produtos: totais.subtotal,
  valor_total: totais.valorFinal,
  status: 1,
  forma_pagamento: dados.forma_pagamento,
  troco: dados.troco ? toNumber(dados.troco) : undefined,
  nota_fiscal: dados.nota_fiscal,
  data_pedido: dados.data_pedido,
  excluido: false,
  produtos: itens.map((item, index) => ({
    id: index + 1,
    pedido_id: pedidoId,
    produto_id: item.id,
    quantidade: item.quantidade,
    observacao: item.observacoes ?? "",
    produto_nome: item.nome,
    preco_base: item.preco,
    atributos: item.atributos.map((attr, attrIndex) => ({
      id: attrIndex + 1,
      pedido_item_id: index + 1,
      atributo_id: attr.atributo_id,
      valor_atributo_id: attr.valor_atributo_id,
      nome_atributo: attr.nome,
      valor: attr.valor,
      preco: attr.preco,
      preco_incluido: attr.preco_incluido,
    })),
  })),
});

/**
 * Mensagem que o cliente envia ao WhatsApp da loja para confirmar o pedido.
 * `linkDetalhes` aponta para o admin (exige login), não para a página pública.
 * Sem resumo (outra aba/aparelho), manda só o número do pedido e o link.
 */
export const montarMensagemWhatsappLoja = (
  pedidoId: number,
  pedido: Pedido | null,
  linkDetalhes: string,
): string => {
  const rodape = `====== Detalhes do Pedido ======\n${linkDetalhes}`;

  if (!pedido) {
    return `====== 🏷 Pedido ${pedidoId} ======\n\nOlá! Acabei de fazer o pedido nº ${pedidoId}.\n\n${rodape}`;
  }

  const produtosTexto = pedido.produtos
    .map((produto) => {
      const atributosTexto = produto.atributos
        .map((attr) => {
          const precoExtra =
            attr.preco > 0
              ? ` (${formatCurrencyBRL(attr.preco)})`
              : "";
          return `${attr.nome_atributo}: ${attr.valor}${precoExtra}`;
        })
        .join("\n");

      const obs = produto.observacao ? `\nObs.: ${produto.observacao}` : "";
      return `${produto.quantidade}x - ${produto.produto_nome}\n${atributosTexto}${obs}`;
    })
    .join("\n\n");

  const entrega =
    pedido.tipo_entrega === "delivery"
      ? `Delivery (Entrega) ${formatCurrencyBRL(pedido.taxa_entrega)}`
      : "Retirar pedido em loja";

  const troco = pedido.troco
    ? ` - Troco para ${formatCurrencyBRL(pedido.troco)}`
    : "";

  const endereco =
    pedido.tipo_entrega === "delivery"
      ? `${pedido.endereco_entrega}, ${pedido.numero} ${pedido.complemento || ""} - ${pedido.bairro} | CEP: ${pedido.cep} ${pedido.referencia || ""}`
      : "Retirar em Loja";

  return `
====== 🏷 Pedido ${pedidoId} ======

${produtosTexto}

${entrega}
Valor Total: ${formatCurrencyBRL(pedido.valor_total)}
${getFormaPagamentoLabel(pedido.forma_pagamento).toUpperCase()}${troco}

====== Dados do Cliente ======

👤 ${pedido.nome_cliente}
📱 ${pedido.telefone}
📍 ${endereco}

${rodape}
`;
};

const storageKey = (pedidoId: number) => `pedido-resumo:${pedidoId}`;

/** Guarda o resumo na aba atual. Falhas (modo privado, cota) são ignoradas. */
export const salvarResumoPedido = (pedido: Pedido): void => {
  if (typeof window === "undefined" || !pedido.id) return;
  try {
    sessionStorage.setItem(storageKey(pedido.id), JSON.stringify(pedido));
  } catch {
    // sem resumo, a página /obrigado mostra só o número do pedido
  }
};

export const lerResumoPedido = (pedidoId: number): Pedido | null => {
  if (typeof window === "undefined") return null;
  try {
    const salvo = sessionStorage.getItem(storageKey(pedidoId));
    return salvo ? (JSON.parse(salvo) as Pedido) : null;
  } catch {
    return null;
  }
};
