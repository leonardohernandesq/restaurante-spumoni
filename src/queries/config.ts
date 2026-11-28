import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { configService } from "@/services/config";
import type { OpeningHour, Settings } from "@/types/config";
import { ordenarPorDiaSemana } from "@/domain/horarios";
import { queryKeys } from "./keys";

/** Configurações da loja (endereço, redes sociais, WhatsApp, bobina...). */
export const useSettingsQuery = () =>
  useQuery({
    queryKey: queryKeys.settings,
    queryFn: configService.buscarConfiguracoes,
  });

/** Horários de funcionamento (rodapé, agendamento e admin), de segunda a domingo. */
export const useOpeningHoursQuery = () =>
  useQuery({
    queryKey: queryKeys.openingHours,
    queryFn: configService.listarHorarios,
    select: ordenarPorDiaSemana,
  });

/** Loja aberta agora? (calculado pela API com horários + "fechado manualmente"). */
export const useStoreStatusQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.storeStatus,
    queryFn: configService.statusLoja,
    select: (status) => status.aberta,
  });

  return { storeOpen: data ?? false, loading: isLoading, error: isError };
};

export const useSaveSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Settings) => configService.salvarConfiguracoes(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      // "fechado manualmente" muda o status da loja
      queryClient.invalidateQueries({ queryKey: queryKeys.storeStatus });
    },
  });
};

/**
 * Remove o horário de um dia (a loja fica fechada nele).
 * A lista de horários só é marcada como desatualizada, sem recarregar agora:
 * recarregar apagaria edições ainda não salvas nos outros dias da tela.
 * O rodapé e o agendamento buscam de novo quando forem abertos.
 */
export const useRemoveOpeningHour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (diaSemana: number) => configService.removerHorario(diaSemana),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.openingHours,
        refetchType: "none",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.storeStatus });
    },
  });
};

/**
 * Salva os horários. POST para todos é intencional: a API recria o horário de
 * cada dia (confirmado pelos ids novos a cada salvamento, sem duplicar dias).
 */
export const useSaveOpeningHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (horarios: OpeningHour[]) => {
      for (const horario of horarios) {
        await configService.criarHorario(horario);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingHours });
      queryClient.invalidateQueries({ queryKey: queryKeys.storeStatus });
    },
  });
};
