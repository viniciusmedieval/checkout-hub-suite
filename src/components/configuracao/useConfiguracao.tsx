
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchCheckoutConfig, fetchTestimonials } from "./services/configServices";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { DEFAULT_CONFIG } from "./utils/defaultConfig";

export function useConfiguracao() {
  const [loading, setLoading] = useState(true);
  
  // Initialize with default config, will be updated in useEffect
  const {
    config,
    setConfig,
    handleConfigChange,
    handleSwitchChange,
    handleSaveConfig
  } = useConfigSettings(DEFAULT_CONFIG);
  
  // Initialize with empty array, will be updated in useEffect
  const {
    depoimentos,
    setDepoimentos,
    depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial
  } = useTestimonials([]);

  useEffect(() => {
    const fetchConfigData = async () => {
      setLoading(true);
      try {
        const checkoutConfig = await fetchCheckoutConfig();
        if (checkoutConfig) {
          setConfig(checkoutConfig);
        }
        
        const testimonials = await fetchTestimonials();
        setDepoimentos(testimonials);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, []);

  return {
    config,
    loading,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleSaveConfig,
    handleDeleteTestimonial,
    handleAddTestimonial
  };
}
