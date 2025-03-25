
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
        // If no slug is provided, fetch the first/default config
        const { data: configData, error: configError } = await supabase
          .from('config_checkout')
          .select('*')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (configError) {
          console.error('Erro ao carregar configuração:', configError);
          setLoadError(`Erro ao carregar configuração: ${configError.message}`);
          setError(configError.message);
          setLoading(false);
          return null;
        } else if (configData) {
          console.log('✅ Configuração carregada com sucesso:', configData);
          setConfigData(configData);
          setConfig(configData);
          
          // Fetch testimonials for this config (product)
          await fetchTestimonials(configData.id);
          
          setLoading(false);
          return configData;
        } else {
          setLoadError('Configuração não encontrada');
          setError('Configuração não encontrada');
          setLoading(false);
          return null;
        }
      } else {
        // If slug is provided, fetch config by slug
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
          
          // Fetch testimonials for this config (product)
          await fetchTestimonials(configData.id);
          
          setLoading(false);
          return configData;
        } else {
          setLoadError('Configuração não encontrada');
          setError('Configuração não encontrada');
          setLoading(false);
          return null;
        }
      }
    } catch (err: any) {
      console.error('Erro ao buscar a configuração:', err);
      setLoadError(`Erro ao buscar a configuração: ${err.message}`);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const fetchTestimonials = async (configId?: number) => {
    try {
      console.log('🔄 Carregando depoimentos para configId:', configId);
      
      let query = supabase
        .from('depoimentos')
        .select('*')
        .order('id', { ascending: false });
      
      // If we have a config ID, filter testimonials by that product ID
      if (configId) {
        query = query.eq('produto_id', configId);
      }
      
      const { data, error } = await query.limit(10);
      
      if (error) {
        console.error('❌ Erro ao carregar depoimentos:', error);
      } else if (data) {
        console.log('✅ Depoimentos carregados:', data.length);
        setDepoimentos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar depoimentos:', error);
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
