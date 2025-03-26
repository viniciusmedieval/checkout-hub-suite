
import { useState } from 'react';
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig as saveConfigService } from "../services";
import { toast } from "sonner";

/**
 * Hook to manage configuration saving state and operations
 */
export const useConfigSaver = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | undefined>(undefined);

  /**
   * Save configuration to the database
   * @param config The configuration to save
   * @returns The saved configuration, or null if saving failed
   */
  const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
    // Reset state at the start
    setIsSaving(true);
    setSavingError(undefined);
    
    try {
      console.log("💾 Saving configuration...", config);
      
      // Call the saveConfig service
      const savedConfig = await saveConfigService(config);
      
      // Handle success case
      if (savedConfig) {
        console.log("✅ Configuration saved successfully", savedConfig);
        toast.success("Configurações salvas com sucesso!");
        
        return {
          ...savedConfig,
          redirect_card_status: (savedConfig.redirect_card_status || "analyzing") as "analyzing" | "approved" | "rejected"
        };
      } 
      
      // Handle error case when service returns null
      const errorMsg = "Erro ao salvar configurações";
      console.error("❌ " + errorMsg);
      setSavingError(errorMsg);
      toast.error(errorMsg);
      return null;
      
    } catch (error: any) {
      // Handle exception case
      const errorMsg = `Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`;
      console.error("❌ " + errorMsg, error);
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
