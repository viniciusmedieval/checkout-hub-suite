
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createMockClient } from './mock/mock-client';

// Re-export all types from the database-types file
export * from './types/database-types';

// Try to get credentials from localStorage first
const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

// Try to get credentials from environment variables as fallback
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use localStorage credentials if available, otherwise use environment variables
const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

// Initialize the Supabase client with error handling
let supabase: SupabaseClient;

// Check if the required credentials are available
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Fallback to mock client
    supabase = createMockClient();
    console.log('Using mock Supabase client due to initialization error');
  }
} else {
  console.warn('Supabase credentials not found, using mock client');
  // Create a mock client
  supabase = createMockClient();
}

// Export the initialized Supabase client
export { supabase };
