
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createMockClient } from './mock/mock-client';

// Re-export all types from the database-types file
export * from './types/database-types';

let supabase: SupabaseClient;

try {
  // Import from the integration path
  const { supabase: integrationClient } = await import('@/integrations/supabase/client');
  
  console.log('Using Supabase integration client');
  supabase = integrationClient;
} catch (error) {
  console.error('Supabase integration client not available, using fallback', error);
  
  // Try to get credentials from localStorage as fallback
  const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
  const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

  // Try to get credentials from environment variables as second fallback
  const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Use localStorage credentials if available, otherwise use environment variables
  const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
  const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

  // Initialize the Supabase client with error handling
  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('Fallback Supabase client initialized successfully with URL:', supabaseUrl);
    } catch (error) {
      console.error('Error initializing fallback Supabase client:', error);
      console.error('Usando mock client devido a falha na inicialização do Supabase');
      // Fallback to mock client
      supabase = createMockClient();
    }
  } else {
    console.warn('Credenciais do Supabase não encontradas. Verifique se as variáveis de ambiente estão configuradas:');
    console.warn('- VITE_SUPABASE_URL: ' + (envSupabaseUrl ? 'Configurada' : 'NÃO CONFIGURADA'));
    console.warn('- VITE_SUPABASE_ANON_KEY: ' + (envSupabaseKey ? 'Configurada' : 'NÃO CONFIGURADA'));
    console.warn('Usando mock client por falta de credenciais.');
    // Create a mock client
    supabase = createMockClient();
  }
}

// Export the initialized Supabase client
export { supabase };
