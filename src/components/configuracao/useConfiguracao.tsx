
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/supabase";
import { fetchCheckoutConfig, fetchTestimonials } from "./services";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { defaultConfig } from "./utils/defaultConfig";
import { toast } from "sonner";
import { PaymentStatus } from "@/components/checkout/payment/types";

export function useConfiguracao() {
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState<ConfigCheckout | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Inicialize com configurações default, será atualizado no useEffect
  const {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
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
    setLoadError(null);
    try {
      const fetchedConfig = await fetchCheckoutConfig();
      console.log('✅ Configuração carregada no reloadConfig:', fetchedConfig);
      
      if (fetchedConfig) {
        setConfigData(fetchedConfig);
        setConfig(fetchedConfig);
      } else {
        console.log('ℹ️ Usando configuração padrão no reloadConfig');
        const defaultConfigWithRedirect = {
          ...defaultConfig,
          redirect_card_status: "analyzing"
        };
        setConfigData(defaultConfigWithRedirect);
        setConfig(defaultConfigWithRedirect);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      setLoadError("Erro ao carregar configurações");
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        // Fetch config
        const fetchedConfig = await fetchCheckoutConfig();
        console.log('✅ Configuração inicial carregada:', fetchedConfig);
        
        if (fetchedConfig) {
          // Ensure redirect_card_status exists
          const configWithRedirect = {
            ...fetchedConfig,
            redirect_card_status: fetchedConfig.redirect_card_status || "analyzing"
          };
          
          setConfigData(configWithRedirect);
          setConfig(configWithRedirect);
        } else {
          console.log('ℹ️ Usando configuração padrão no useEffect inicial');
          const defaultConfigWithRedirect = {
            ...defaultConfig,
            redirect_card_status: "analyzing"
          };
          setConfigData(defaultConfigWithRedirect);
          setConfig(defaultConfigWithRedirect);
        }
        
        // Fetch testimonials
        const testimonialsData = await fetchTestimonials();
        if (testimonialsData) {
          setDepoimentos(testimonialsData);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
        setLoadError("Erro ao carregar configurações");
        toast.error('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para salvar as configurações e forçar recarregamento
  const saveAndReloadConfig = async () => {
    try {
      console.log("🔄 Iniciando saveAndReloadConfig com:", config);
      
      if (!config) {
        console.error("❌ Configuração vazia ou nula");
        toast.error("Erro: Configuração vazia ou nula");
        return false;
      }
      
      // Ensure required fields
      const configToSave = {
        ...config,
        redirect_card_status: config.redirect_card_status || "analyzing"
      };
      
      // Salvar a configuração
      const savedConfig = await handleSaveConfig();
      
      if (savedConfig) {
        console.log("✅ Configurações salvas com sucesso:", savedConfig);
        toast.success("Configurações aplicadas com sucesso!");
        
        // Atualizar o estado local com os dados salvos
        setConfigData(savedConfig);
        setConfig(savedConfig);
        
        // Força recarregar do banco de dados para garantir consistência
        setTimeout(() => {
          reloadConfig();
        }, 500);
        
        return true;
      } else {
        console.error("❌ Falha ao salvar configurações: retorno nulo");
        toast.error("Configurações não foram salvas. Verifique os erros.");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao salvar e recarregar:", error);
      toast.error("Erro ao salvar as configurações");
      return false;
    }
  };

  return {
    config,
    loading,
    loadError,
    isSaving,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSaveConfig: saveAndReloadConfig,
    hasUnsavedChanges,
    reloadConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  };
}
