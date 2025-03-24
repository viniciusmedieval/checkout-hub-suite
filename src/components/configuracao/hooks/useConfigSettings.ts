
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
      const numValue = parseInt(value) || 0;
      console.log(`Convertendo ${name} para número: ${numValue}`);
      setConfig(prev => ({ ...prev, [name]: numValue }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    console.log(`useConfigSettings - Alterando switch ${name} para ${checked}`);
    setConfig(prev => {
      const updated = { ...prev, [name]: checked };
      console.log(`Novo valor de ${name}:`, checked);
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
      console.log("Iniciando salvamento da configuração:", config);
      
      // Clone config to avoid reference issues
      const configToSave = JSON.parse(JSON.stringify(config));
      
      // Ensure boolean and number fields are correctly typed
      Object.keys(configToSave).forEach(key => {
        if (typeof configToSave[key] === 'string' && (configToSave[key] === 'true' || configToSave[key] === 'false')) {
          configToSave[key] = configToSave[key] === 'true';
        }
        if ((key === 'contador_min' || key === 'contador_max') && typeof configToSave[key] === 'string') {
          configToSave[key] = parseInt(configToSave[key]) || 0;
        }
      });
      
      const updatedConfig = await saveConfig(configToSave);
      
      if (updatedConfig) {
        console.log("Configuração salva com sucesso:", updatedConfig);
        
        // Atualizar o estado com os dados retornados do servidor
        setConfig(updatedConfig);
        setLastSavedConfig(updatedConfig);
        return updatedConfig;
      } else {
        console.error("Erro ao salvar configurações: retorno nulo");
        return null;
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!lastSavedConfig) return Object.keys(config).length > 0;
    
    // Use JSON.stringify to properly compare objects
    return JSON.stringify(config) !== JSON.stringify(lastSavedConfig);
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
