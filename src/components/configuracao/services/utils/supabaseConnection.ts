
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Checks if the Supabase connection is working
 * @throws Error if connection fails
 */
export const checkConnection = async (): Promise<void> => {
  const client = await getSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está disponível");
  }
  
  // Use a simple query to verify connection
  const { error: connectionError } = await client
    .from('config_checkout')
    .select('id')
    .limit(1);
    
  if (connectionError) {
    throw new Error(`Falha ao testar conexão: ${connectionError.message}`);
  }
};

/**
 * Performs a database operation with proper error handling
 * @param operation The database operation function to execute
 * @param errorMessage The error message to display if the operation fails
 * @returns The result of the operation or null if it fails
 */
export const performDatabaseOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error(errorMessage, error);
    throw new Error(`${errorMessage}: ${error.message}`);
  }
};
