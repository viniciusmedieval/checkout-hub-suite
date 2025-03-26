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

// NOTE: This interface is being deprecated in favor of using the one from database-types.ts
// It's kept here temporarily for backward compatibility
export interface ConfigCheckout {
  id: number;
  mensagem_topo?: string | null;
  cor_topo?: string | null;
  cor_texto_topo?: string | null;
  ativa_banner?: boolean | null;
  banner_url?: string | null;
  banner_mobile_url?: string | null;
  cor_banner?: string | null;
  cor_fundo?: string | null;
  cor_titulo?: string | null;
  texto_botao?: string | null;
  cor_botao?: string | null;
  cor_texto_botao?: string | null;
  texto_botao_card?: string | null;
  cor_botao_card?: string | null;
  cor_texto_botao_card?: string | null;
  texto_botao_pix?: string | null;
  cor_botao_pix?: string | null;
  cor_texto_botao_pix?: string | null;
  rodape_texto?: string | null;
  rodape_empresa?: string | null;
  rodape_ano?: string | null;
  mostrar_seguro?: boolean | null;
  mensagem_rodape?: string | null;
  url_termos_uso?: string | null;
  url_politica_privacidade?: string | null;
  mensagem_termos?: string | null;
  mostrar_contador?: boolean | null;
  texto_contador?: string | null;
  contador_min?: number | null;
  contador_max?: number | null;
  cor_texto_contador?: string | null;
  mostrar_campo_documento?: boolean | null;
  mostrar_campo_telefone?: boolean | null;
  mostrar_bandeira_brasil?: boolean | null;
  mostrar_prefixo_telefone?: boolean | null;
  mostrar_campo_nascimento?: boolean | null;
  titulo_identificacao?: string | null;
  titulo_pagamento?: string | null;
  cor_icones?: string | null;
  icone_nome?: string | null;
  icone_email?: string | null;
  icone_telefone?: string | null;
  icone_documento?: string | null;
  validar_cpf?: boolean | null;
  validar_telefone?: boolean | null;
  validar_cartao?: boolean | null;
  validar_nascimento?: boolean | null;
  criado_em?: string | null;
  redirect_card_status?: "analyzing" | "approved" | "rejected";
  modo_random?: boolean | null;
  max_installments?: number | null;
  pix_titulo?: string | null;
  pix_subtitulo?: string | null;
  pix_instrucoes?: string | null;
  pix_mensagem_seguranca?: string | null;
  cor_primaria_pix?: string | null;
  cor_secundaria_pix?: string | null;
  tipo_chave_pix_global?: string | null;
  chave_pix_global?: string | null;
  nome_beneficiario_pix?: string | null;
  qr_code_pix_url?: string | null;
  usar_api_pix_global?: boolean | null;
  url_api_pix_global?: string | null;
  mostrar_depoimentos?: boolean | null;
  slug?: string | null;
  pix_secao_id?: number | null;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  slug: string;
  valor: number;
  tipo: string;
  checkout_title?: string;
  checkout_button_text?: string;
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
  url_pix_api?: string;
  usar_config_pix_global?: boolean;
  qr_code_pix_url?: string;
}
