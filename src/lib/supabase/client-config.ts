
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Configuration options for creating a Supabase client
 */
export interface SupabaseClientOptions {
  url: string;
  key: string;
}

/**
 * Creates a configured Supabase client
 */
export const createSupabaseClient = (options: SupabaseClientOptions): SupabaseClient | null => {
  try {
    const client = createClient(options.url, options.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined
      }
    });

    if (!client) {
      throw new Error("Falha ao criar cliente Supabase");
    }

    return client;
  } catch (error) {
    console.error('❌ Erro crítico ao inicializar cliente Supabase:', error);
    return null;
  }
};
