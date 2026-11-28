import { CATEGORIA_DESTAQUE } from "@/constants/app";

/** Coloca a categoria de destaque ("Pratos do Dia") primeiro, mantendo a ordem do resto. */
export const ordenarComDestaque = <T>(
  itens: T[],
  getNome: (item: T) => string | undefined,
): T[] =>
  [...itens].sort((a, b) => {
    if (getNome(a) === CATEGORIA_DESTAQUE) return -1;
    if (getNome(b) === CATEGORIA_DESTAQUE) return 1;
    return 0;
  });
