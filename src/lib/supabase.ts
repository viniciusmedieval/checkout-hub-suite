
// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { checkSupabaseCredentials } from './env-check';

// Re-export all types from the database-types file
export * from './types/database-types';

// Variável global para o cliente Supabase
let supabase: SupabaseClient;

// Função para inicializar o cliente Supabase de forma síncrona
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
    
    // 4. Logar o estado das credenciais para debugging
    console.log("🔑 Estado das credenciais Supabase:", {
      localStorage: { url: !!localSupabaseUrl, key: !!localSupabaseKey },
      envVars: { url: !!envSupabaseUrl, key: !!envSupabaseKey },
      hasEnvCredentials
    });
    
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

    // 5. Usar credenciais do localStorage se disponíveis, caso contrário usar variáveis de ambiente
    const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
    const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Credenciais incompletas para inicializar o cliente Supabase.');
      return null;
    }

    // 6. Inicializar o cliente Supabase
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

// Inicialização síncrona do cliente Supabase com fallback
supabase = initializeSupabaseClient() as SupabaseClient;

// Função para tentar importar o cliente Supabase integrado de forma assíncrona
const importIntegratedClient = () => {
  // Verificar se o cliente já foi inicializado
  if (!supabase) {
    console.warn("⚠️ Nenhum cliente Supabase inicializado, não será possível carregar o cliente integrado");
    return;
  }

  // Importar o cliente integrado apenas no navegador
  if (typeof window !== 'undefined') {
    import('@/integrations/supabase/client')
      .then(({ supabase: integrationClient }) => {
        if (integrationClient) {
          console.log('✅ Usando cliente Supabase integrado');
          supabase = integrationClient;
        }
      })
      .catch(error => {
        console.error('❌ Cliente Supabase integrado não disponível, usando fallback', error);
      });
  }
};

// Tentar carregar o cliente integrado
importIntegratedClient();

// Exportar o cliente Supabase
export { supabase };
