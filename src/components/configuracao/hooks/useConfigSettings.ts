
import { useState } from "react";
import { ConfigCheckout } from "@/lib/supabase";
import { saveConfig } from "../services/configServices";
import { defaultConfig } from "../utils/defaultConfig";

export function useConfigSettings(initialConfig: ConfigCheckout | null = null) {
  const [config, setConfig] = useState<ConfigCheckout>(initialConfig || defaultConfig);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    try {
      console.log("Salvando configurações:", config);
      const updatedConfig = await saveConfig(config);
      
      if (updatedConfig) {
        setConfig(updatedConfig);
      }
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
    handleSaveConfig
  };
}
