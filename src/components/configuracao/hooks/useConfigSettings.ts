
import { useState, useEffect } from "react";
import { ConfigCheckout } from "@/lib/supabase";
import { saveConfig } from "../services";
import { defaultConfig } from "../utils/defaultConfig";
import { toast } from "sonner";

export function useConfigSettings(initialConfig: ConfigCheckout | null = null) {
  const [config, setConfig] = useState<ConfigCheckout>(initialConfig || defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedConfig, setLastSavedConfig] = useState<ConfigCheckout | null>(null);

  // Atualiza o estado inicial quando o initialConfig mudar
  useEffect(() => {
    if (initialConfig) {
      console.log('useConfigSettings - Atualizando config inicial:', initialConfig);
      setConfig(initialConfig);
      setLastSavedConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`useConfigSettings - Alterando ${name} para ${value}`);
    
    // Handle numeric fields
    if (name === 'contador_min' || name === 'contador_max') {
      setConfig(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
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
        console.log("Configurações salvas com sucesso:", updatedConfig);
        // Importante: atualizar o estado com os dados retornados do servidor
        setConfig(updatedConfig);
        setLastSavedConfig(updatedConfig);
        toast.success("Configurações salvas com sucesso!");
        return updatedConfig; // Retorna as configurações atualizadas para uso no componente pai
      } else {
        toast.error("Erro ao salvar configurações. Verifique o console para mais detalhes.");
        return null;
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!lastSavedConfig) return Object.keys(config).length > 0;
    
    // Compare significant fields in the config
    for (const key in config) {
      if (config[key] !== lastSavedConfig[key]) {
        return true;
      }
    }
    return false;
  };

  return {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleSaveConfig,
    hasUnsavedChanges
  };
}
