
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClient } from './client-config';
import { getSupabaseCredentials } from './credentials';

// Export types
export * from './types';

// Global Supabase client
let supabase: SupabaseClient | null = null;

/**
 * Initializes the Supabase client with available credentials
 */
const initializeSupabaseClient = (): SupabaseClient | null => {
  try {
    // Get credentials from available sources
    const { url, key } = getSupabaseCredentials();
    
    // Create client with the credentials
    const client = createSupabaseClient({ url, key });
    
    if (client) {
      console.log('✅ Cliente Supabase inicializado com sucesso.');
    }
    
    return client;
  } catch (error) {
    console.error('❌ Erro crítico ao inicializar cliente Supabase:', error);
    return null;
  }
};

// Initialize the client immediately
supabase = initializeSupabaseClient();

/**
 * Loads the integrated Supabase client if available
 */
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

// Try to load the integrated client without blocking
if (typeof window !== 'undefined') {
  loadIntegratedClient().catch(err => {
    console.error('❌ Erro ao carregar cliente integrado:', err);
  });
}

/**
 * Checks if Supabase client is initialized
 */
export const isSupabaseInitialized = (): boolean => {
  return !!supabase;
};

/**
 * Reinitializes the Supabase client with new credentials
 */
export const reinitializeSupabaseClient = (url: string, key: string): SupabaseClient | null => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabaseUrl', url);
      localStorage.setItem('supabaseKey', key);
    }
    
    const client = createSupabaseClient({ url, key });
    
    if (client) {
      supabase = client;
      console.log('✅ Cliente Supabase reinicializado com novas credenciais');
    }
    
    return client;
  } catch (error) {
    console.error('❌ Erro ao reinicializar cliente Supabase:', error);
    return null;
  }
};

// Export the Supabase client
export { supabase };
