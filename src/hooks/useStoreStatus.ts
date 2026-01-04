import { useEffect, useState } from "react";
import { configService } from "@/services/config";

export const useStoreStatus = () => {
  const [storeOpen, setStoreOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // TODO: change to backend communication
        const { data } = await configService.getStatusLoja();
        setStoreOpen(data.aberta);

        console.log("esta aberto:", data);
        // setStoreOpen(true);
      } catch (error) {
        console.error("Erro ao verificar status da loja:", error);
        setStoreOpen(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { storeOpen, loading };
};
