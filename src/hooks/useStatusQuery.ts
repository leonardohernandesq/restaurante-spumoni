import { useAppQuery } from "@/hooks/useAppQuery";
import { configService } from "@/services/config";

interface StatusLoja {
  aberta: boolean;
  horario: string;
}

export const useStatusQuery = () => {
  const { data, isLoading, isError } = useAppQuery({
    queryKey: ["storeStatus"],
    queryFn: async (): Promise<StatusLoja> => {
      const response = await configService.getStatusLoja();
      return response.data;
    },
    select: (data) => data.aberta,
  });

  return { storeOpen: data ?? false, loading: isLoading, error: isError };
};
