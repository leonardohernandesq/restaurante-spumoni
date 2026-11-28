/**
 * 1 = novo, 4 = finalizado, 0 = cancelado. Os antigos 2 (preparando) e
 * 3 (saindo para entrega) não são mais usados. "Excluído" é um campo à parte.
 */
export type PedidoStatus = 0 | 1 | 4;

interface PedidoStatusInfo {
  label: string;
  color: string;
  /** Texto do botão de ação no detalhe do pedido (admin). */
  actionLabel: string;
  /** Mensagem enviada ao cliente pelo WhatsApp ao mudar para este status. */
  whatsappMessage: (
    nomeCliente: string,
    pedido?: { numero?: number; retirada?: boolean },
  ) => string;
}

const ASSINATURA = "Somos do *Restaurante & Sorveteria Spumoni* :)";

export const PEDIDO_STATUS: Record<PedidoStatus, PedidoStatusInfo> = {
  0: {
    label: "Cancelado",
    color: "bg-red-700",
    actionLabel: "Cancelar Pedido",
    whatsappMessage: (nome) =>
      `Olá ${nome}, ${ASSINATURA}\nSeu pedido foi *cancelado*. Se tiver dúvidas, estamos à disposição.`,
  },
  1: {
    label: "Novo pedido",
    color: "bg-yellow-600",
    actionLabel: "Novo Pedido",
    whatsappMessage: (nome) =>
      `Olá ${nome}, ${ASSINATURA}\nRecebemos seu pedido <3 Em breve começaremos o preparo.`,
  },
  4: {
    label: "Finalizado",
    color: "bg-green-700",
    actionLabel: "Concluir Pedido",
    // Única mensagem que o cliente recebe: pedido aceito e em preparo
    whatsappMessage: (nome, { numero, retirada } = {}) =>
      [
        `${saudacao(nome)} 😊`,
        "Aqui é do *Restaurante & Sorveteria Spumoni*.",
        "",
        `Seu pedido${numero ? ` *#${numero}*` : ""} foi *aceito* e já está sendo preparado com todo o carinho! 🍽️`,
        retirada
          ? "Assim que ficar pronto, é só vir buscar aqui na loja."
          : "Assim que ficar pronto, ele sai para a entrega até você. 🛵",
        "",
        "Obrigado pela preferência! ⛄💜",
      ].join("\n"),
  },
};

/** "Olá, Cindy!" com o primeiro nome; sem nome, só "Olá!". */
export const saudacao = (nome?: string): string => {
  const primeiro = nome?.trim().split(/\s+/)[0];
  return primeiro ? `Olá, ${primeiro}!` : "Olá!";
};

/** Nome no singular e no plural, para frases como "78 pedidos cancelados". */
const NOME_CONTAGEM: Record<PedidoStatus, [string, string]> = {
  0: ["pedido cancelado", "pedidos cancelados"],
  1: ["novo pedido", "novos pedidos"],
  4: ["pedido finalizado", "pedidos finalizados"],
};
const NOME_EXCLUIDOS: [string, string] = ["pedido excluído", "pedidos excluídos"];

const numero = new Intl.NumberFormat("pt-BR");
const contar = (n: number, [um, varios]: [string, string]) =>
  `${numero.format(n)} ${n === 1 ? um : varios}`;

/**
 * Frase do resumo da lista de pedidos conforme o filtro:
 * - sem filtro: "3.748 pedidos";
 * - um filtro: "78 pedidos cancelados";
 * - vários: "168 pedidos: 162 novos pedidos · 6 pedidos excluídos".
 */
export const descreverContagemPedidos = (
  total: number,
  filtro: { status: number[]; excluidos: boolean },
  contagem?: { status: Record<number, number>; excluidos: number },
): string => {
  const partes = [...filtro.status]
    .sort((a, b) => a - b)
    .filter((s): s is PedidoStatus => s in NOME_CONTAGEM)
    .map((s) => contar(contagem?.status[s] ?? 0, NOME_CONTAGEM[s]));
  if (filtro.excluidos) partes.push(contar(contagem?.excluidos ?? 0, NOME_EXCLUIDOS));

  const geral = contar(total, ["pedido", "pedidos"]);
  if (partes.length === 0 || !contagem) return geral;
  if (partes.length === 1) return partes[0];
  return `${geral}: ${partes.join(" · ")}`;
};

/** Ordem dos filtros: novo, finalizado, cancelado. */
export const PEDIDO_STATUS_LIST: PedidoStatus[] = [1, 4, 0];

export const getStatusInfo = (status: number): PedidoStatusInfo | undefined =>
  PEDIDO_STATUS[status as PedidoStatus];

export const getStatusLabel = (status: number): string =>
  getStatusInfo(status)?.label ?? "Desconhecido";

export const getStatusColor = (status: number): string =>
  getStatusInfo(status)?.color ?? "bg-gray-400";

const FORMAS_PAGAMENTO: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

export const getFormaPagamentoLabel = (forma?: string): string =>
  (forma && FORMAS_PAGAMENTO[forma.toLowerCase()]) || forma || "—";

export const getTipoEntregaLabel = (tipo?: string): string =>
  tipo === "takeaway" ? "Retirada na loja" : "Delivery (Entrega)";

/**
 * Pedidos que ainda não estavam em `idsConhecidos` e chegaram como "Novo pedido".
 * Usado para tocar o som no gestor de pedidos a cada atualização do polling.
 */
export const getNovosPedidos = <
  T extends { id?: number | string; status?: number | string; excluido?: boolean },
>(
  idsConhecidos: ReadonlySet<number>,
  pedidos: T[],
): T[] => {
  // Pedido novo tem número maior que todos os já vistos. Assim um pedido
  // antigo que volta para a lista (ex.: restaurado da lixeira) não toca o som.
  const maiorConhecido = Math.max(0, ...idsConhecidos);
  return pedidos.filter(
    (p) =>
      p.id != null &&
      !idsConhecidos.has(Number(p.id)) &&
      Number(p.id) > maiorConhecido &&
      Number(p.status) === 1 &&
      !p.excluido,
  );
};

/** Status vem da API às vezes como string ("1"); 0 (cancelado) é válido. */
export const hasStatus = (status: unknown): boolean =>
  status !== null && status !== undefined && status !== "";
