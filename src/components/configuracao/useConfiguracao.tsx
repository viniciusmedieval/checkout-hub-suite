
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/supabase";
import { fetchCheckoutConfig, fetchTestimonials } from "./services";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { defaultConfig } from "./utils/defaultConfig";

export function useConfiguracao() {
  const [loading, setLoading] = useState(true);
  
  // Initialize with default config, will be updated in useEffect
  const {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
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
          setConfig(configData);
        }
        
        // Fetch testimonials
        const testimonialsData = await fetchTestimonials();
        setDepoimentos(testimonialsData);
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
    handleSaveConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial // Include the new function
  };
}
