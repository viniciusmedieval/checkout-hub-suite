
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
        // Certifica que o config atual também é atualizado
        setConfig(fetchedConfig);
      } else {
        console.log('Usando configuração padrão');
        toast.info('Usando configuração padrão');
        setConfigData(defaultConfig);
        // Certifica que o config atual também é atualizado
        setConfig(defaultConfig);
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
    try {
      console.log("Iniciando saveAndReloadConfig com:", config);
      const savedConfig = await handleSaveConfig();
      if (savedConfig) {
        console.log("Configurações salvas com sucesso:", savedConfig);
        toast.success("Configurações aplicadas com sucesso!");
        // Garantir que o estado local seja atualizado com os dados retornados
        setConfigData(savedConfig);
        // Certifica que o config atual também é atualizado
        setConfig(savedConfig);
      } else {
        console.log("Falha ao salvar configurações");
        toast.error("Configurações não foram salvas. Verifique os erros.");
      }
    } catch (error) {
      console.error("Erro ao salvar e recarregar:", error);
      toast.error("Erro ao salvar as configurações");
    }
  };

  return {
    config,
    loading,
    isSaving,
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
