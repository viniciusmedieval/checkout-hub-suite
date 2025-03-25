import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ConfigCheckout, Depoimento } from '@/lib/types/database-types';
import { useConfigLoader } from './hooks/useConfigLoader';
import { useConfigSaver } from './hooks/useConfigSaver';

interface ConfiguracaoContextValue {
  config: ConfigCheckout;
  depoimentos: Depoimento[];
  loading: boolean;
  error: string;
  loadError?: string;
  configData?: ConfigCheckout;
  reloadConfig: () => Promise<void>;
  setConfig: (newConfig: ConfigCheckout) => void;
  setDepoimentos: Dispatch<SetStateAction<Depoimento[]>>;
}

const ConfiguracaoContext = React.createContext<ConfiguracaoContextValue>({
  config: {} as ConfigCheckout,
  depoimentos: [],
  loading: false,
  error: '',
  reloadConfig: async () => {},
  setConfig: () => {},
  setDepoimentos: () => {}
});

interface ConfiguracaoProviderProps {
  children: React.ReactNode;
}

export const ConfiguracaoProvider: React.FC<ConfiguracaoProviderProps> = ({ children }) => {
  const { config, depoimentos, loading, error, loadError, configData, reloadConfig } = useConfigLoader();
  const { saveConfig, isSaving, savingError } = useConfigSaver();
  const [currentConfig, setCurrentConfig] = useState<ConfigCheckout>(config);
  const [currentDepoimentos, setCurrentDepoimentos] = useState<Depoimento[]>(depoimentos);

  useEffect(() => {
    setCurrentConfig(config);
    setCurrentDepoimentos(depoimentos);
  }, [config, depoimentos]);

  const setConfig = (newConfig: ConfigCheckout) => {
    setCurrentConfig(newConfig);
    saveConfig(newConfig);
  };

  const setDepoimentos = (newDepoimentos: Depoimento[]) => {
    setCurrentDepoimentos(newDepoimentos);
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
    setDepoimentos,
    isSaving,
    savingError
  }), [currentConfig, currentDepoimentos, loading, error, loadError, configData, reloadConfig, isSaving, savingError]);

  return (
    <ConfiguracaoContext.Provider value={value}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};

export const useConfiguracao = () => React.useContext(ConfiguracaoContext);
