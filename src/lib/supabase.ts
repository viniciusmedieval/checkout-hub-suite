
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createMockClient } from './mock/mock-client';

// Re-export all types from the database-types file
export * from './types/database-types';

// Tentar obter as credenciais do localStorage primeiro
const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

// Tentar obter credenciais das variáveis de ambiente como fallback
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Usar as credenciais do localStorage se disponíveis, senão usar as do ambiente
const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

// Initialize the Supabase client with error handling
let supabase: SupabaseClient;

// Check if the required credenciais are available
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized with provided credentials');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Fallback to mock client
    supabase = createMockClient();
  }
} else {
  console.warn('Supabase credentials not found, using mock client');
  // Create a mock client
  supabase = createMockClient();
}

export type ConfigCheckout = {
  id: number;
  mensagem_topo: string;
  cor_topo: string;
  cor_texto_topo: string;
  ativa_banner: boolean;
  banner_url: string;
  banner_mobile_url: string;
  cor_banner: string;
  cor_fundo: string;
  cor_titulo: string;
  texto_botao: string;
  cor_botao: string; // Propriedade para cor do botão CTA
  cor_texto_botao: string; // Nova propriedade para cor do texto do botão CTA
  rodape_texto: string;
  rodape_empresa: string;
  rodape_ano: string;
  mostrar_seguro: boolean;
  mensagem_rodape: string;
  mensagem_termos?: string; // Nova propriedade para mensagem de termos
  url_termos_uso?: string;
  url_politica_privacidade?: string;
  // Form customization properties
  mostrar_campo_documento?: boolean;
  mostrar_campo_telefone?: boolean;
  titulo_identificacao?: string;
  titulo_pagamento?: string;
  // Visitor counter properties
  mostrar_contador?: boolean;
  texto_contador?: string;
  contador_min?: number;
  contador_max?: number;
  // New properties for icon customization
  cor_icones?: string;
  icone_nome?: string;
  icone_email?: string;
  icone_telefone?: string;
  icone_documento?: string;
};

export { supabase };
