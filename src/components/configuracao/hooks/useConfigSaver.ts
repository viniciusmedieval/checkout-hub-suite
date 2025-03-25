
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig } from "../services";
import { toast } from "sonner";

export const useConfigSaver = (
  config: ConfigCheckout,
  reloadConfig: () => Promise<ConfigCheckout | null>
) => {
  // Save and reload configuration
  const saveAndReloadConfig = async () => {
    try {
      console.log("💾 Salvando configuração:", config);
      
      // Call the saveConfig service
      const savedConfig = await saveConfig(config);
      
      if (savedConfig) {
        toast.success("Configurações salvas com sucesso!");
        
        // Reload the configuration to get the latest data
        const reloadedConfig = await reloadConfig();
        return reloadedConfig;
      } else {
        toast.error("Erro ao salvar configurações");
        return null;
      }
    } catch (error) {
      console.error("❌ Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
      return null;
    }
  };

  return {
    saveAndReloadConfig
  };
};
