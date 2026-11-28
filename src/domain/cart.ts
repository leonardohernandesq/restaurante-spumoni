/**
 * Gera a chave que identifica uma "variação" de produto no carrinho.
 *
 * Dois itens só são somados (quantidade + quantidade) quando têm a mesma
 * chave: mesmo produto, mesmos valores de atributo (em qualquer ordem) e a
 * mesma observação. Qualquer diferença vira um item separado.
 */
export const buildCartItemKey = (
  produtoId: number,
  valorAtributoIds: number[],
  observacoes = "",
): string => {
  const atributos = [...valorAtributoIds].sort((a, b) => a - b).join(",");
  const obs = observacoes.trim().toLowerCase();

  return `${produtoId}|${atributos}|${obs}`;
};
