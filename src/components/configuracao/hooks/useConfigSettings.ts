
import { useState, useEffect } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig } from "../services";
import { toast } from "sonner";
import { defaultConfig } from "../utils/defaultConfig";
import { PaymentStatus } from "@/components/checkout/payment/types";

export const useConfigSettings = (initialConfig: ConfigCheckout | null) => {
  const [config, setConfig] = useState<ConfigCheckout>(initialConfig || defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<ConfigCheckout | null>(initialConfig);

  useEffect(() => {
    if (initialConfig) {
      console.log("useConfigSettings: recebeu nova configuração inicial", initialConfig);
      setConfig(initialConfig);
      setOriginalConfig(initialConfig);
    }
  }, [initialConfig]);

  // Handler for text input changes with improved debugging
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`handleConfigChange fired: ${name} = "${value}"`);
    
    setConfig(prev => {
      const updated = { ...prev, [name]: value };
      console.log(`Config updated for ${name}:`, updated);
      return updated;
    });
  };

  // Handler for switch changes with improved debugging
  const handleSwitchChange = (name: string, checked: boolean) => {
    console.log(`handleSwitchChange fired: ${name} = ${checked}`);
    
    setConfig(prev => {
      const updated = { ...prev, [name]: checked };
      console.log(`Config updated for ${name}:`, updated);
      return updated;
    });
  };

  // Handler for icon selection
  const handleIconChange = (iconField: string, iconName: string) => {
    console.log(`handleIconChange fired: ${iconField} = ${iconName}`);
    
    setConfig(prev => ({ ...prev, [iconField]: iconName }));
  };
  
  // Handler for select changes (dropdown)
  const handleSelectChange = (name: string, value: string | number) => {
    console.log(`handleSelectChange fired: ${name} = ${value}`);
    
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  // Handler for status field
  const handleStatusChange = (status: PaymentStatus) => {
    // Ensure the status is a valid value for the type
    if (!["analyzing", "approved", "rejected"].includes(status)) {
      status = "analyzing";
    }
    
    console.log(`handleStatusChange fired: redirect_card_status = ${status}`);
    setConfig(prev => ({ ...prev, redirect_card_status: status }));
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!originalConfig) return true;
    
    // Compare original config with current config
    const originalJson = JSON.stringify(originalConfig);
    const currentJson = JSON.stringify(config);
    const hasChanges = originalJson !== currentJson;
    
    console.log(`hasUnsavedChanges check: ${hasChanges}`);
    return hasChanges;
  };

  // Save config function
  const handleSaveConfig = async (): Promise<ConfigCheckout | null> => {
    try {
      console.log("handleSaveConfig: Iniciando salvamento", config);
      setIsSaving(true);
      
      // Call the saveConfig service
      const savedConfig = await saveConfig(config);
      
      if (savedConfig) {
        console.log("handleSaveConfig: Configuração salva com sucesso", savedConfig);
        
        // Ensure the redirect_card_status is properly typed
        const typedSavedConfig = {
          ...savedConfig,
          redirect_card_status: (savedConfig.redirect_card_status || "analyzing") as PaymentStatus,
          pix_secao_id: savedConfig.pix_secao_id || null
        };
        
        // Update the original config to match the current config
        setOriginalConfig(typedSavedConfig);
        setConfig(typedSavedConfig);
        return typedSavedConfig;
      }
      
      console.error("Falha ao salvar configuração");
      return null;
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    handleSaveConfig,
    hasUnsavedChanges
  };
};
