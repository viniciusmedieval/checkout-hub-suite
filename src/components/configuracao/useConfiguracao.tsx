
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ConfigCheckout, Depoimento } from '@/lib/types/database-types';
import { useConfigLoader } from './hooks/useConfigLoader';
import { useConfigSaver } from './hooks/useConfigSaver';
import { useConfigSettings } from './hooks/useConfigSettings';
import { useTestimonials } from './hooks/useTestimonials';
import { PaymentStatus } from "@/components/checkout/payment/types";

interface ConfiguracaoContextValue {
  config: ConfigCheckout;
  depoimentos: Depoimento[];
  loading: boolean;
  error: string;
  loadError?: string;
  configData?: ConfigCheckout;
  reloadConfig: () => Promise<ConfigCheckout | null>;
  setConfig: (newConfig: ConfigCheckout) => void;
  setDepoimentos: Dispatch<SetStateAction<Depoimento[]>>;
  isSaving: boolean;
  depoimentosSaving: boolean;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleIconChange: (iconField: string, iconName: string) => void;
  handleStatusChange: (status: PaymentStatus) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSaveConfig: () => Promise<ConfigCheckout | null>;
  hasUnsavedChanges: () => boolean;
  handleDeleteTestimonial: (id: number) => Promise<void>;
  handleAddTestimonial: (depoimento: Omit<Depoimento, "id" | "criado_em">) => Promise<void>;
  handleUpdateTestimonial: (id: number, depoimento: Partial<Depoimento>) => Promise<void>;
}

const ConfiguracaoContext = React.createContext<ConfiguracaoContextValue>({
  config: {} as ConfigCheckout,
  depoimentos: [],
  loading: false,
  error: '',
  reloadConfig: async () => null,
  setConfig: () => {},
  setDepoimentos: () => {},
  isSaving: false,
  depoimentosSaving: false,
  handleConfigChange: () => {},
  handleSwitchChange: () => {},
  handleIconChange: () => {},
  handleStatusChange: () => {},
  handleSelectChange: () => {},
  handleSaveConfig: async () => null,
  hasUnsavedChanges: () => false,
  handleDeleteTestimonial: async () => {},
  handleAddTestimonial: async () => {},
  handleUpdateTestimonial: async () => {}
});

interface ConfiguracaoProviderProps {
  children: React.ReactNode;
}

export const ConfiguracaoProvider: React.FC<ConfiguracaoProviderProps> = ({ children }) => {
  const { config, depoimentos, loading, error, loadError, configData, reloadConfig } = useConfigLoader();
  const { saveConfig, isSaving, savingError } = useConfigSaver();
  const {
    config: currentConfig,
    setConfig: setCurrentConfig,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    handleSaveConfig: saveConfigSettings,
    hasUnsavedChanges
  } = useConfigSettings(config);
  
  const {
    depoimentos: currentDepoimentos,
    setDepoimentos: setCurrentDepoimentos,
    isLoading: depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useTestimonials(config?.id);

  useEffect(() => {
    setCurrentConfig(config);
  }, [config]);

  useEffect(() => {
    // Fix: Make sure the types match by setting an array of Depoimentos
    if (Array.isArray(depoimentos)) {
      setCurrentDepoimentos(depoimentos);
    }
  }, [depoimentos]);

  const setConfig = (newConfig: ConfigCheckout) => {
    setCurrentConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleSaveConfig = async (): Promise<ConfigCheckout | null> => {
    const savedConfig = await saveConfigSettings();
    if (savedConfig) {
      await reloadConfig();
      return savedConfig;
    }
    return null;
  };

  const value = React.useMemo(() => ({
    config: currentConfig,
    depoimentos: currentDepoimentos,
    loading,
    error,
    loadError,
    configData,
    reloadConfig,
    setConfig,
    setDepoimentos: setCurrentDepoimentos,
    isSaving,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    handleSaveConfig,
    hasUnsavedChanges,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  }), [
    currentConfig, 
    currentDepoimentos, 
    loading, 
    error, 
    loadError, 
    configData, 
    reloadConfig, 
    isSaving,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    hasUnsavedChanges,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  ]);

  return (
    <ConfiguracaoContext.Provider value={value}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};

export const useConfiguracao = () => React.useContext(ConfiguracaoContext);
