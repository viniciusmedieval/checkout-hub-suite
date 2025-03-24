
import { useState } from "react";
import { ConfigCheckout } from "@/lib/supabase";
import { saveConfig } from "../services";
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
    // Log before setting the state to debug
    console.log("Estado atual do config antes da mudança:", config);
    
    setConfig(prev => {
      const updated = { ...prev, [name]: checked };
      console.log("Novo estado do config após a mudança:", updated);
      return updated;
    });
  };

  const handleIconChange = (name: string, value: string) => {
    console.log(`useConfigSettings - Alterando ícone ${name} para ${value}`);
    setConfig(prev => ({ ...prev, [name]: value }));
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
    handleIconChange,
    handleSaveConfig
  };
}
