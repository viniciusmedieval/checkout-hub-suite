
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ConfigCheckout, Depoimento } from "@/lib/types/database-types";
import { defaultConfig } from '../utils/defaultConfig';
import { fetchCheckoutConfig, fetchTestimonials } from '../services';

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
      console.log("🔍 Iniciando busca de configuração...");
      
      // Tenta buscar usando o serviço centralizado
      const configFromService = await fetchCheckoutConfig();
      
      if (configFromService) {
        console.log("✅ Configuração carregada do serviço:", configFromService);
        setConfigData(configFromService);
        setConfig(configFromService);
        
        // Fetch testimonials for this config (product)
        await loadTestimonials(configFromService.id);
        
        setLoading(false);
        return configFromService;
      }
      
      // Fallback para busca direta se o serviço não retornar dados
      console.log("ℹ️ Usando método de fallback para buscar configuração...");
      
      if (!slug) {
        // If no slug is provided, fetch the first/default config
        const { data: configData, error: configError } = await supabase
          .from('config_checkout')
          .select('*')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (configError) {
          console.error('❌ Erro ao carregar configuração (fallback):', configError);
          setLoadError(`Erro ao carregar configuração: ${configError.message}`);
          setError(configError.message);
          setLoading(false);
          return null;
        } else if (configData) {
          console.log("✅ Configuração carregada (fallback direto):", configData);
          setConfigData(configData);
          setConfig(configData);
          
          // Fetch testimonials for this config (product)
          await loadTestimonials(configData.id);
          
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
          await loadTestimonials(configData.id);
          
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
      console.error('❌ Erro ao buscar a configuração:', err);
      setLoadError(`Erro ao buscar a configuração: ${err.message}`);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const loadTestimonials = async (configId?: number) => {
    try {
      console.log("🔍 Carregando depoimentos para a configuração ID:", configId || "geral");
      
      // Usando o serviço centralizado
      const testimonialsData = await fetchTestimonials(configId);
      
      if (testimonialsData && testimonialsData.length > 0) {
        console.log(`✅ ${testimonialsData.length} depoimentos carregados com sucesso via serviço.`);
        setDepoimentos(testimonialsData);
        return;
      }
      
      // Fallback - buscar diretamente do Supabase
      console.log("ℹ️ Tentando buscar depoimentos diretamente do Supabase...");
      
      let query = supabase
        .from('depoimentos')
        .select('*')
        .order('id', { ascending: false });
      
      // If we have a config ID, filter testimonials by that product ID
      if (configId) {
        query = query.eq('produto_id', configId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Erro ao carregar depoimentos (fallback):', error);
        // Not setting error state here as testimonials are secondary
      } else if (data && data.length > 0) {
        console.log(`✅ ${data.length} depoimentos carregados com sucesso (fallback direto).`);
        setDepoimentos(data);
      } else {
        console.log("ℹ️ Nenhum depoimento encontrado. Usando depoimentos padrão.");
        // Importar e usar depoimentos padrão
        const { defaultTestimonials } = await import('@/components/checkout/testimonials/DefaultTestimonials');
        setDepoimentos(defaultTestimonials);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar depoimentos:', error);
      // Carregar depoimentos padrão em caso de erro
      try {
        const { defaultTestimonials } = await import('@/components/checkout/testimonials/DefaultTestimonials');
        setDepoimentos(defaultTestimonials);
        console.log("ℹ️ Usando depoimentos padrão após erro.");
      } catch (importError) {
        console.error('❌ Erro ao importar depoimentos padrão:', importError);
      }
    }
  };

  useEffect(() => {
    console.log("🔄 useConfigLoader - useEffect executado", slug ? `com slug: ${slug}` : "sem slug");
    fetchConfig();
  }, [slug]);

  const reloadConfig = async (): Promise<ConfigCheckout | null> => {
    console.log("🔄 Recarregando configurações...");
    return await fetchConfig();
  };

  return { config, depoimentos, loading, error, loadError, configData, reloadConfig };
};
