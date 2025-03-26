
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClient } from './client-config';
import { getSupabaseCredentials } from './credentials';

// Export types
export * from './types';

// Create a singleton pattern for the Supabase client
let _supabaseInstance: SupabaseClient | null = null;
let _isInitializing = false;
let _initPromise: Promise<SupabaseClient | null> | null = null;

/**
 * Gets the singleton Supabase client, initializing it if needed
 */
export const getSupabaseClient = async (): Promise<SupabaseClient | null> => {
  // Return existing instance if available
  if (_supabaseInstance) {
    return _supabaseInstance;
  }

  // If already initializing, return the promise to prevent multiple initializations
  if (_isInitializing && _initPromise) {
    return _initPromise;
  }

  // Start initialization
  _isInitializing = true;
  _initPromise = initializeSupabaseClient();
  return _initPromise;
};

/**
 * Initializes the Supabase client with available credentials
 */
const initializeSupabaseClient = async (): Promise<SupabaseClient | null> => {
  try {
    console.log("🔄 Initializing Supabase client...");
    
    // Get credentials from available sources
    const { url, key } = getSupabaseCredentials();
    
    // Create client with the credentials
    const client = createSupabaseClient({ url, key });
    
    if (client) {
      console.log('✅ Cliente Supabase inicializado com sucesso.');
      _supabaseInstance = client;
      
      // Try to load the integrated client without blocking
      if (typeof window !== 'undefined') {
        try {
          const { supabase: integrationClient } = await import('@/integrations/supabase/client');
          if (integrationClient) {
            console.log('✅ Usando cliente Supabase integrado');
            _supabaseInstance = integrationClient;
          }
        } catch (error) {
          console.warn('⚠️ Cliente Supabase integrado não disponível, usando fallback', error);
        }
      }
    }
    
    return _supabaseInstance;
  } catch (error) {
    console.error('❌ Erro crítico ao inicializar cliente Supabase:', error);
    return null;
  } finally {
    _isInitializing = false;
  }
};

// Ensure initialization happens once on module load
if (typeof window !== 'undefined') {
  initializeSupabaseClient().catch(err => {
    console.error('❌ Erro ao inicializar cliente Supabase:', err);
  });
}

/**
 * Checks if Supabase client is initialized
 */
export const isSupabaseInitialized = (): boolean => {
  return !!_supabaseInstance;
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
      _supabaseInstance = client;
      console.log('✅ Cliente Supabase reinicializado com novas credenciais');
    }
    
    return client;
  } catch (error) {
    console.error('❌ Erro ao reinicializar cliente Supabase:', error);
    return null;
  }
};

// For backward compatibility, export the client directly with a proxy to ensure it's initialized
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    if (!_supabaseInstance) {
      console.warn('⚠️ Accessing Supabase client before initialization. Initializing synchronously...');
      // Initialize synchronously for direct access compatibility
      const { url, key } = getSupabaseCredentials();
      _supabaseInstance = createSupabaseClient({ url, key });
    }
    return _supabaseInstance?.[prop as keyof SupabaseClient];
  }
});
