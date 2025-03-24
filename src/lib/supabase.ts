// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { checkSupabaseCredentials } from './env-check';

// Re-export all types from the database-types file
export * from './types/database-types';

let supabase: SupabaseClient;

// Função para inicializar o cliente Supabase
const initializeSupabaseClient = async (): Promise<SupabaseClient> => {
  // 1. Tentar usar o cliente integrado
  try {
    const { supabase: integrationClient } = await import('@/integrations/supabase/client');
    console.log('✅ Usando cliente Supabase integrado');
    return integrationClient;
  } catch (error) {
    console.error('❌ Cliente Supabase integrado não disponível, usando fallback', error);
  }

  // 2. Tentar obter credenciais do localStorage (fallback 1)
  const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
  const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

  // 3. Tentar obter credenciais das variáveis de ambiente (fallback 2)
  const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 4. Verificar credenciais usando checkSupabaseCredentials
  const hasEnvCredentials = checkSupabaseCredentials();
  if (!hasEnvCredentials && !localSupabaseUrl && !localSupabaseKey) {
    console.error('❌ Nenhuma credencial do Supabase encontrada (nem no localStorage, nem nas variáveis de ambiente).');
    console.error('❌ Variáveis de ambiente verificadas:');
    console.error('- VITE_SUPABASE_URL:', envSupabaseUrl || 'NÃO CONFIGURADA');
    console.error('- VITE_SUPABASE_ANON_KEY:', envSupabaseKey || 'NÃO CONFIGURADA');
    console.error('❌ Credenciais no localStorage:');
    console.error('- supabaseUrl:', localSupabaseUrl || 'NÃO CONFIGURADA');
    console.error('- supabaseKey:', localSupabaseKey || 'NÃO CONFIGURADA');
    throw new Error('Credenciais do Supabase não configuradas. O cliente Supabase não será inicializado.');
  }

  // 5. Usar credenciais do localStorage se disponíveis, caso contrário usar variáveis de ambiente
  const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
  const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Credenciais incompletas para inicializar o cliente Supabase.');
    throw new Error('Credenciais do Supabase incompletas. Verifique o localStorage ou as variáveis de ambiente.');
  }

  // 6. Inicializar o cliente Supabase
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Cliente Supabase inicializado com sucesso. URL:', supabaseUrl);
    return client;
  } catch (error) {
    console.error('❌ Erro ao inicializar cliente Supabase:', error);
    throw new Error('Falha ao inicializar o cliente Supabase: ' + error.message);
  }
};

// Inicializar o cliente Supabase
try {
  supabase = await initializeSupabaseClient();
} catch (error) {
  console.error('❌ Falha crítica ao inicializar o cliente Supabase:', error);
  throw error; // Lançar erro para interromper a execução
}

// Exportar o cliente inicializado
export { supabase };
