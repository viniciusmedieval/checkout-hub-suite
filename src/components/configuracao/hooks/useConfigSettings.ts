
import { useState } from "react";
import { ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { saveConfigSettings } from "../services/configServices";
import { DEFAULT_CONFIG } from "../utils/defaultConfig";

export function useConfigSettings(initialConfig: ConfigCheckout = DEFAULT_CONFIG) {
  const [config, setConfig] = useState<ConfigCheckout>(initialConfig);
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`useConfigSettings - Alterando ${name} para ${value}`);
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    console.log(`useConfigSettings - Alterando switch ${name} para ${checked}`);
    setConfig(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveConfig = async () => {
    try {
      console.log("Salvando configurações:", config);
      
      const refreshedConfig = await saveConfigSettings(config);
      
      if (refreshedConfig) {
        setConfig(refreshedConfig);
      }
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    }
  };

  return {
    config,
    setConfig,
    handleConfigChange,
    handleSwitchChange,
    handleSaveConfig
  };
}
