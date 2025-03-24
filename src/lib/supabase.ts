
// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { checkSupabaseCredentials } from './env-check';

// Re-export all types from the database-types file
export * from './types/database-types';

let supabase: SupabaseClient;

// Função para inicializar o cliente Supabase
const initializeSupabaseClient = (): SupabaseClient | null => {
  try {
    // 1. Tentar obter credenciais do localStorage (fallback 1)
    const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
    const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

    // 2. Tentar obter credenciais das variáveis de ambiente (fallback 2)
    const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // 3. Verificar credenciais usando checkSupabaseCredentials
    const hasEnvCredentials = checkSupabaseCredentials();
    if (!hasEnvCredentials && !localSupabaseUrl && !localSupabaseKey) {
      console.error('❌ Nenhuma credencial do Supabase encontrada (nem no localStorage, nem nas variáveis de ambiente).');
      console.error('❌ Variáveis de ambiente verificadas:');
      console.error('- VITE_SUPABASE_URL:', envSupabaseUrl || 'NÃO CONFIGURADA');
      console.error('- VITE_SUPABASE_ANON_KEY:', envSupabaseKey || 'NÃO CONFIGURADA');
      console.error('❌ Credenciais no localStorage:');
      console.error('- supabaseUrl:', localSupabaseUrl || 'NÃO CONFIGURADA');
      console.error('- supabaseKey:', localSupabaseKey || 'NÃO CONFIGURADA');
      return null;
    }

    // 4. Usar credenciais do localStorage se disponíveis, caso contrário usar variáveis de ambiente
    const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
    const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Credenciais incompletas para inicializar o cliente Supabase.');
      return null;
    }

    // 5. Inicializar o cliente Supabase
    try {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      console.log('✅ Cliente Supabase inicializado com sucesso. URL:', supabaseUrl);
      return client;
    } catch (error) {
      console.error('❌ Erro ao inicializar cliente Supabase:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Falha crítica ao inicializar o cliente Supabase:', error);
    return null;
  }
};

// Função para importar o cliente Supabase integrado de forma assíncrona
const importIntegratedClient = async (): Promise<SupabaseClient | null> => {
  try {
    const { supabase: integrationClient } = await import('@/integrations/supabase/client');
    console.log('✅ Usando cliente Supabase integrado');
    return integrationClient;
  } catch (error) {
    console.error('❌ Cliente Supabase integrado não disponível, usando fallback', error);
    return null;
  }
};

// Inicializar o cliente Supabase de forma síncrona primeiro
supabase = initializeSupabaseClient() as SupabaseClient;

// Tentar atualizar para o cliente integrado de forma assíncrona
if (typeof window !== 'undefined') {
  // Executar apenas no navegador
  importIntegratedClient().then(client => {
    if (client) {
      supabase = client;
    }
  });
}

// Exportar o cliente inicializado
export { supabase };
