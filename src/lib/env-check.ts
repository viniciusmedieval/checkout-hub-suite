
/**
 * Utility to check for required environment variables
 */

export function checkSupabaseCredentials(): boolean {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Supabase credentials not found in environment variables!");
    console.error("Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file");
    return false;
  }
  
  console.log("✅ Supabase credentials found");
  return true;
}
