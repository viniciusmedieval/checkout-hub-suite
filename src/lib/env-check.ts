
/**
 * Utility to check for required environment variables
 */

export function checkSupabaseCredentials(): boolean {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Credenciais do Supabase não encontradas nas variáveis de ambiente!");
    console.error("Por favor, verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env");
    return false;
  }
  
  console.log("✅ Credenciais do Supabase encontradas");
  return true;
}
