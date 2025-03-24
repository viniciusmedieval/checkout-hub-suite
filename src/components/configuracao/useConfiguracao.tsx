
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/supabase";
import { fetchCheckoutConfig, fetchTestimonials } from "./services";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { defaultConfig } from "./utils/defaultConfig";
import { toast } from "sonner";

export function useConfiguracao() {
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState<ConfigCheckout | null>(null);
  
  // Inicialize com configurações default, será atualizado no useEffect
  const {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleSaveConfig,
    hasUnsavedChanges
  } = useConfigSettings(configData);
  
  // Inicialize com array vazio, será atualizado no useEffect
  const {
    depoimentos,
    setDepoimentos,
    isLoading: depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useTestimonials([]);

  // Função para recarregar as configurações do banco de dados
  const reloadConfig = async () => {
    setLoading(true);
    try {
      const fetchedConfig = await fetchCheckoutConfig();
      if (fetchedConfig) {
        console.log('Configuração carregada:', fetchedConfig);
        setConfigData(fetchedConfig);
      } else {
        console.log('Usando configuração padrão');
        toast.info('Usando configuração padrão');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch config
        await reloadConfig();
        
        // Fetch testimonials
        const testimonialsData = await fetchTestimonials();
        setDepoimentos(testimonialsData);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para salvar as configurações e recarregar
  const saveAndReloadConfig = async () => {
    await handleSaveConfig();
    await reloadConfig();
  };

  return {
    config,
    loading,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleSaveConfig: saveAndReloadConfig,
    hasUnsavedChanges,
    reloadConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  };
}
