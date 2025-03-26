
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { createNewConfig } from "./createConfig";
import { performDatabaseOperation } from "../utils/supabaseConnection";

/**
 * Updates an existing configuration in the database
 */
export async function updateExistingConfig(config: ConfigCheckout, configToSave: any): Promise<ConfigCheckout | null> {
  try {
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    if (!client) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Verify the record exists
    const checkRecordExists = async () => {
      const { data, error } = await client
        .from("config_checkout")
        .select("id")
        .eq("id", config.id)
        .maybeSingle();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    };
    
    const existingRecord = await performDatabaseOperation(
      checkRecordExists,
      "Erro ao verificar configuração existente"
    );
    
    // If record doesn't exist, create a new one
    if (!existingRecord) {
      return await createNewConfig(configToSave);
    }

    // Update the existing configuration
    const updateOperation = async () => {
      const { data, error } = await client
        .from("config_checkout")
        .update(configToSave)
        .eq("id", config.id)
        .select("*");
        
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || data.length === 0) {
        // Try to fetch the updated data if update didn't return it
        const { data: fetchedData, error: fetchError } = await client
          .from("config_checkout")
          .select("*")
          .eq("id", config.id)
          .maybeSingle();
          
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        
        if (!fetchedData) {
          throw new Error("Não foi possível recuperar dados após atualização");
        }
        
        return fetchedData;
      }
      
      return data[0];
    };
    
    const updatedData = await performDatabaseOperation(
      updateOperation,
      "Erro ao atualizar configuração"
    );
    
    if (!updatedData) {
      return null;
    }
    
    const processedData = ensureBooleanFields(updatedData);
    
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("Erro ao atualizar configuração:", error);
    toast.error("Erro ao atualizar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
