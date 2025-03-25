
import { useState } from 'react';
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig as saveConfigService } from "../services";
import { toast } from "sonner";

export const useConfigSaver = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | undefined>(undefined);

  // Save config function
  const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
    try {
      setIsSaving(true);
      setSavingError(undefined);
      
      console.log("💾 Salvando configuração:", config);
      
      // Call the saveConfig service
      const savedConfig = await saveConfigService(config);
      
      if (savedConfig) {
        toast.success("Configurações salvas com sucesso!");
        return savedConfig;
      } else {
        const errorMsg = "Erro ao salvar configurações";
        setSavingError(errorMsg);
        toast.error(errorMsg);
        return null;
      }
    } catch (error: any) {
      console.error("❌ Erro ao salvar configurações:", error);
      const errorMsg = `Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`;
      setSavingError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveConfig,
    isSaving,
    savingError
  };
};
