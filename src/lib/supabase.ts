
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
  console.log('Supabase integration client not available, using fallback', error);
  
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
      // Fallback to mock client
      supabase = createMockClient();
      console.log('Using mock Supabase client due to initialization error');
    }
  } else {
    console.warn('Supabase credentials not found, using mock client');
    // Create a mock client
    supabase = createMockClient();
  }
}

// Export the initialized Supabase client
export { supabase };
