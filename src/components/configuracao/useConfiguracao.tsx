
import { useState } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { useConfigLoader } from "./hooks/useConfigLoader";
import { useConfigSaver } from "./hooks/useConfigSaver";

export function useConfiguracao() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Load configuration and testimonials
  const {
    loading,
    loadError,
    configData,
    depoimentos,
    setDepoimentos,
    reloadConfig
  } = useConfigLoader();
  
  // Initialize with loaded configuration
  const {
    config,
    setConfig,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    hasUnsavedChanges
  } = useConfigSettings(configData);
  
  // Initialize testimonials management
  const {
    isLoading: depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useTestimonials(depoimentos);
  
  // Initialize configuration saving
  const { saveAndReloadConfig } = useConfigSaver(config, reloadConfig);
  
  // Wrapper function for saving with loading state
  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const result = await saveAndReloadConfig();
      return result;
    } finally {
      setIsSaving(false);
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
    handleSelectChange,
    handleSaveConfig,
    hasUnsavedChanges,
    reloadConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  };
}
