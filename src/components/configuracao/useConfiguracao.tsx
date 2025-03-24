
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/supabase";
import { fetchCheckoutConfig, fetchTestimonials } from "./services";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { defaultConfig } from "./utils/defaultConfig";
import { toast } from "sonner";

export function useConfiguracao() {
  const [loading, setLoading] = useState(true);
  
  // Initialize with default config, will be updated in useEffect
  const {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleSaveConfig
  } = useConfigSettings(defaultConfig);
  
  // Initialize with empty array, will be updated in useEffect
  const {
    depoimentos,
    setDepoimentos,
    isLoading: depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useTestimonials([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch config
        const configData = await fetchCheckoutConfig();
        if (configData) {
          console.log('Configuração carregada:', configData);
          setConfig(configData);
        } else {
          console.log('Usando configuração padrão');
          toast.info('Usando configuração padrão');
        }
        
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

  return {
    config,
    loading,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleSaveConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  };
}
