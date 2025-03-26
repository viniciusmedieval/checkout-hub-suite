
import { checkSupabaseCredentials } from '../env-check';

/**
 * Gets available Supabase credentials from various sources
 */
export const getSupabaseCredentials = (): { url: string, key: string } => {
  // 1. Try to get credentials from localStorage (highest priority)
  const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
  const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

  // 2. Try to get credentials from environment variables
  const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 3. Default values as fallback
  const defaultUrl = 'https://wqijkkbxqkpbjbqehlqw.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWpra2J4cWtwYmpicWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODcwNDYsImV4cCI6MjA1ODI2MzA0Nn0.IerDihb1CqSIVqootaphhkBUG4maAhLiVkqapvGWLhU';
  
  // Use the first available credentials in priority order
  const supabaseUrl = localSupabaseUrl || envSupabaseUrl || defaultUrl;
  const supabaseKey = localSupabaseKey || envSupabaseKey || defaultKey;

  // Log credential source for debugging
  const credentialSource = {
    usandoLocalStorage: !!(localSupabaseUrl && localSupabaseKey),
    usandoEnvVars: !!(envSupabaseUrl && envSupabaseKey) && !(localSupabaseUrl && localSupabaseKey),
    usandoPadrao: !localSupabaseUrl && !envSupabaseUrl && !localSupabaseKey && !envSupabaseKey
  };
  
  console.log("🔑 Origem das credenciais Supabase:", {
    ...credentialSource,
    url: supabaseUrl.substring(0, 15) + '...' // Show only part of the URL for security
  });

  return { url: supabaseUrl, key: supabaseKey };
};
