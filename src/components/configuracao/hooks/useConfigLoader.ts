import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ConfigCheckout, Depoimento } from "@/lib/types/database-types";

const defaultConfig: ConfigCheckout = {
  id: 0,
  nome: '',
  cor_primaria: '#000000',
  cor_secundaria: '#FFFFFF',
  cor_texto: '#000000',
  cor_fundo: '#FFFFFF',
  mostrar_banner: true,
  url_banner: '',
  mostrar_campo_nome: true,
  mostrar_campo_email: true,
  mostrar_campo_telefone: true,
  mostrar_campo_documento: true,
  texto_termos: '',
  url_termos: '',
  validar_cpf: false,
  validar_telefone: false,
  mostrar_campo_nascimento: false,
  validar_nascimento: false,
  validar_cartao: false,
  cor_botao: '#000000',
  cor_texto_botao: '#FFFFFF',
  redirect_card_status: 'analyzing',
  mensagem_seguranca: '',
  mensagem_produto: '',
  max_installments: 1,
  modo_random: false,
  mostrar_depoimentos: false,
  mostrar_contador: false,
  texto_aviso_contador: '',
  slug: ''
};

interface ConfigLoaderResult {
  config: ConfigCheckout;
  depoimentos: Depoimento[];
  loading: boolean;
  error: string;
  loadError?: string;
  configData?: ConfigCheckout;
}

export const useConfigLoader = (slug?: string): ConfigLoaderResult => {
  const [config, setConfig] = useState<ConfigCheckout>(defaultConfig);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState<string | undefined>(undefined);
  const [configData, setConfigData] = useState<ConfigCheckout | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setError('Slug não fornecido');
      setLoading(false);
      return;
    }

    const fetchConfig = async () => {
      setLoading(true);
      try {
        const { data: configData, error: configError } = await supabase
          .from('config_checkout')
          .select('*')
          .eq('slug', slug)
          .single();

        if (configError) {
          setLoadError(`Erro ao carregar configuração: ${configError.message}`);
          setError(configError.message);
        } else if (configData) {
          setConfigData(configData);
          setConfig(configData);
        } else {
          setLoadError('Configuração não encontrada');
          setError('Configuração não encontrada');
        }

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
      } catch (err: any) {
        console.error('Erro ao buscar a configuração:', err);
        setLoadError(`Erro ao buscar a configuração: ${err.message}`);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [slug]);

  return { config, depoimentos, loading, error, loadError, configData };
};
