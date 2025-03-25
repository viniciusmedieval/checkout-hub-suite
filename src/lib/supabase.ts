// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { checkSupabaseCredentials } from './env-check';

// Re-export all types from the database-types file
export * from './types/database-types';

// Variável global para o cliente Supabase
let supabase: SupabaseClient | null = null;

/**
 * Configura e inicializa o cliente Supabase com as credenciais disponíveis
 * @returns Cliente Supabase configurado ou null se falhar
 */
const createSupabaseClient = (): SupabaseClient | null => {
  try {
    // 1. Obter credenciais do localStorage (primeira opção)
    const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
    const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

    // 2. Obter credenciais das variáveis de ambiente (segunda opção)
    const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // 3. Definir valores padrão (terceira opção)
    const defaultUrl = 'https://wqijkkbxqkpbjbqehlqw.supabase.co';
    const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWpra2J4cWtwYmpicWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODcwNDYsImV4cCI6MjA1ODI2MzA0Nn0.IerDihb1CqSIVqootaphhkBUG4maAhLiVkqapvGWLhU';
    
    // 4. Usar a primeira credencial disponível na ordem: localStorage > env > padrão
    const supabaseUrl = localSupabaseUrl || envSupabaseUrl || defaultUrl;
    const supabaseKey = localSupabaseKey || envSupabaseKey || defaultKey;

    // 5. Logar o estado das credenciais para debugging
    console.log("🔑 Origem das credenciais Supabase:", {
      usandoLocalStorage: !!(localSupabaseUrl && localSupabaseKey),
      usandoEnvVars: !!(envSupabaseUrl && envSupabaseKey) && !(localSupabaseUrl && localSupabaseKey),
      usandoPadrao: !localSupabaseUrl && !envSupabaseUrl && !localSupabaseKey && !envSupabaseKey,
      url: supabaseUrl.substring(0, 15) + '...' // Mostrar apenas parte da URL para segurança
    });

    // 6. Inicializar o cliente Supabase com configurações adicionais
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined
      }
    });

    // 7. Verificar se o cliente foi inicializado corretamente
    if (!client) {
      throw new Error("Falha ao criar cliente Supabase");
    }

    console.log('✅ Cliente Supabase inicializado com sucesso.');
    return client;
  } catch (error) {
    console.error('❌ Erro crítico ao inicializar cliente Supabase:', error);
    return null;
  }
};

// Inicialização imediata do cliente Supabase
supabase = createSupabaseClient();

// Função para tentar importar o cliente Supabase integrado
const loadIntegratedClient = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      const { supabase: integrationClient } = await import('@/integrations/supabase/client');
      if (integrationClient) {
        console.log('✅ Usando cliente Supabase integrado');
        supabase = integrationClient;
      }
    }
  } catch (error) {
    console.warn('⚠️ Cliente Supabase integrado não disponível, usando fallback', error);
  }
};

// Carregar o cliente integrado sem bloquear
if (typeof window !== 'undefined') {
  loadIntegratedClient().catch(err => {
    console.error('❌ Erro ao carregar cliente integrado:', err);
  });
}

/**
 * Verifica se o cliente Supabase está inicializado
 * @returns true se o cliente estiver disponível
 */
export const isSupabaseInitialized = (): boolean => {
  return !!supabase;
};

/**
 * Reinicializa o cliente Supabase com novas credenciais
 * @param url URL do Supabase
 * @param key Chave anônima do Supabase
 */
export const reinitializeSupabaseClient = (url: string, key: string): SupabaseClient | null => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabaseUrl', url);
      localStorage.setItem('supabaseKey', key);
    }
    
    const client = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined
      }
    });
    
    if (client) {
      supabase = client;
      console.log('✅ Cliente Supabase reinicializado com novas credenciais');
      return client;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao reinicializar cliente Supabase:', error);
    return null;
  }
};

// Exportar o cliente Supabase e funções auxiliares
export { supabase };

export interface ConfigCheckout {
  id: number;
  ativa_banner?: boolean;
  mostrar_seguro?: boolean;
  validar_cpf?: boolean;
  validar_telefone?: boolean;
  validar_cartao?: boolean;
  validar_nascimento?: boolean;
  contador_min?: number;
  contador_max?: number;
  mostrar_contador?: boolean;
  texto_contador?: string;
  cor_texto_contador?: string;
  mostrar_campo_documento?: boolean;
  mostrar_campo_telefone?: boolean;
  mostrar_campo_nascimento?: boolean;
  mostrar_bandeira_brasil?: boolean;
  mostrar_prefixo_telefone?: boolean;
  titulo_identificacao?: string;
  titulo_pagamento?: string;
  cor_icones?: string;
  icone_nome?: string;
  icone_email?: string;
  icone_telefone?: string;
  icone_documento?: string;
  mensagem_topo?: string;
  cor_topo?: string;
  cor_texto_topo?: string;
  banner_url?: string;
  banner_mobile_url?: string;
  cor_banner?: string;
  cor_fundo?: string;
  cor_titulo?: string;
  texto_botao?: string;
  cor_botao?: string;
  cor_texto_botao?: string;
  rodape_texto?: string;
  rodape_empresa?: string;
  rodape_ano?: string;
  url_termos_uso?: string;
  url_politica_privacidade?: string;
  mensagem_rodape?: string;
  mensagem_termos?: string;
  criado_em?: string;
  redirect_card_status?: string;
  modo_random?: boolean;
  
  // PIX Config fields
  pix_titulo?: string;
  pix_subtitulo?: string;
  pix_instrucoes?: string;
  pix_mensagem_seguranca?: string;
  cor_primaria_pix?: string;
  cor_secundaria_pix?: string;
  cor_botao_pix?: string;
  cor_texto_botao_pix?: string;
  tipo_chave_pix_global?: string;
  chave_pix_global?: string;
  nome_beneficiario_pix?: string;
  qr_code_pix_url?: string;
  usar_api_pix_global?: boolean;
  url_api_pix_global?: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  slug: string;
  valor: number;
  tipo: string;
  checkout_title?: string;
  imagem_url?: string;
  banner_url?: string;
  banner_mobile_url?: string;
  background_color?: string;
  banner_color?: string;
  ativo?: boolean;
  criado_em?: string;
  
  // PIX-related fields
  tipo_chave_pix?: string;
  chave_pix?: string;
  nome_beneficiario?: string;
  usar_api_pix?: boolean;
  url_api_pix?: string;
  usar_config_pix_global?: boolean;
  qr_code_pix_url?: string;
}
