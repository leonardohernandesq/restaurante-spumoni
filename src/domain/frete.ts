import type { Frete } from "@/types/frete";

const normalizar = (valor?: string) => (valor ?? "").trim().toLowerCase();

/** O frete editado no admin é diferente do que veio do servidor? */
export const isFreteAlterado = (original: Frete, atual: Frete): boolean =>
  original.bairro !== atual.bairro ||
  original.cidade !== atual.cidade ||
  String(original.preco) !== String(atual.preco);

/**
 * Encontra o frete pela combinação cidade + bairro.
 * Só o bairro não basta: o mesmo nome pode existir em duas cidades.
 */
export const findFrete = (
  fretes: Frete[],
  cidade: string,
  bairro: string,
): Frete | undefined => {
  if (!bairro) return undefined;

  return fretes.find(
    (f) =>
      normalizar(f.bairro) === normalizar(bairro) &&
      normalizar(f.cidade) === normalizar(cidade),
  );
};

/** Taxa de entrega em número; 0 para retirada ou bairro sem frete cadastrado. */
export const calcularTaxaEntrega = (
  fretes: Frete[],
  cidade: string,
  bairro: string,
  tipoEntrega: "delivery" | "takeaway",
): number => {
  if (tipoEntrega === "takeaway") return 0;

  const frete = findFrete(fretes, cidade, bairro);
  const valor = frete ? parseFloat(frete.preco) : 0;

  return Number.isFinite(valor) ? valor : 0;
};
