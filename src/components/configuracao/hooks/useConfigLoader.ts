
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ConfigCheckout, Depoimento } from "@/lib/types/database-types";
import { defaultConfig } from '../utils/defaultConfig';

export interface ConfigLoaderResult {
  config: ConfigCheckout;
  depoimentos: Depoimento[];
  loading: boolean;
  error: string;
  loadError?: string;
  configData?: ConfigCheckout;
  reloadConfig: () => Promise<ConfigCheckout | null>;
}

export const useConfigLoader = (slug?: string): ConfigLoaderResult => {
  const [config, setConfig] = useState<ConfigCheckout>(defaultConfig);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState<string | undefined>(undefined);
  const [configData, setConfigData] = useState<ConfigCheckout | undefined>(undefined);

  const fetchConfig = async (): Promise<ConfigCheckout | null> => {
    setLoading(true);
    try {
      if (!slug) {
        setError('Slug não fornecido');
        setLoading(false);
        return null;
      }

      const { data: configData, error: configError } = await supabase
        .from('config_checkout')
        .select('*')
        .eq('slug', slug)
        .single();

      if (configError) {
        setLoadError(`Erro ao carregar configuração: ${configError.message}`);
        setError(configError.message);
        setLoading(false);
        return null;
      } else if (configData) {
        setConfigData(configData);
        setConfig(configData);
        
        const { data: depoimentosData, error: depoimentosError } = await supabase
          .from('depoimentos')
          .select('*')
          .eq('produto_id', configData?.id)
          .limit(5);

        if (depoimentosError) {
          console.error('Erro ao carregar depoimentos:', depoimentosError);
        } else if (depoimentosData) {
          setDepoimentos(depoimentosData);
        }
        
        setLoading(false);
        return configData;
      } else {
        setLoadError('Configuração não encontrada');
        setError('Configuração não encontrada');
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      console.error('Erro ao buscar a configuração:', err);
      setLoadError(`Erro ao buscar a configuração: ${err.message}`);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [slug]);

  const reloadConfig = async (): Promise<ConfigCheckout | null> => {
    return await fetchConfig();
  };

  return { config, depoimentos, loading, error, loadError, configData, reloadConfig };
};
