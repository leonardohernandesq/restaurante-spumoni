import { useAppQuery } from "@/hooks/useAppQuery";
import { configService } from "@/services/config";
import { Settings } from "@/store/configStore";

export const useSettingsQuery = () => {
  return useAppQuery<Settings[], Error, Settings | null>({
    queryKey: ["settings"],
    queryFn: async (): Promise<Settings[]> => {
      const response = await configService.getSettings();
      return Array.isArray(response) ? response : [response];
    },
    select: (data) => (data && data.length > 0 ? data[0] : null),
  });
};
