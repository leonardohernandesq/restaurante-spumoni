/** Ordena por dia da semana: 1 = segunda … 7 = domingo. */
export const ordenarPorDiaSemana = <T extends { dia_semana: string | number }>(
  horarios: T[],
): T[] =>
  [...horarios].sort((a, b) => Number(a.dia_semana) - Number(b.dia_semana));
