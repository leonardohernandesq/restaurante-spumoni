export const getDiaSemana = (dia_semana: number | string): string => {
  const dia = parseInt(dia_semana as string, 10);

  const dias = {
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
    7: 'Domingo'
  };

  return dias[dia as keyof typeof dias] ?? 'Desconhecido';
}
