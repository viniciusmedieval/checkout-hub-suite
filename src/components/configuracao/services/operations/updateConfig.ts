
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { createNewConfig } from "./createConfig";
import { performDatabaseOperation, isTestConfiguration } from "../utils/supabaseConnection";

/**
 * Updates an existing configuration in the database
 */
export async function updateExistingConfig(config: ConfigCheckout, configToSave: any): Promise<ConfigCheckout | null> {
  try {
    // Check if this is a test configuration
    const isTest = isTestConfiguration(configToSave);
    
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    if (!client) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Verify the record exists
    const checkRecordExists = async () => {
      if (isTest) {
        console.log("Executando verificação de teste com ID:", config.id);
        // For test configurations, pretend the record exists
        return { id: config.id };
      }
      
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
      "Erro ao verificar configuração existente",
      isTest
    );
    
    // If record doesn't exist, create a new one
    if (!existingRecord) {
      if (isTest) {
        // For test config, just return success without creating
        console.log("Teste: Configuração não existe, simulando criação");
        toast.success("Teste: Configurações atualizadas com sucesso!");
        return configToSave as ConfigCheckout;
      }
      return await createNewConfig(configToSave);
    }

    // Update the existing configuration
    const updateOperation = async () => {
      if (isTest) {
        console.log("Executando operação de teste (update) com valores:", configToSave);
        // For test configurations, we simulate a successful response
        return {
          ...configToSave,
          id: config.id,
          criado_em: config.criado_em || new Date().toISOString()
        };
      }
      
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
      "Erro ao atualizar configuração",
      isTest
    );
    
    if (!updatedData) {
      // For test configuration, show a success message even if data is null
      if (isTest) {
        toast.success("Teste: Configurações atualizadas com sucesso!");
        return configToSave as ConfigCheckout;
      }
      return null;
    }
    
    const processedData = ensureBooleanFields(updatedData);
    
    if (isTest) {
      toast.success("Teste: Configurações atualizadas com sucesso!");
    } else {
      toast.success("Configurações salvas com sucesso!");
    }
    
    return processedData;
  } catch (error: any) {
    console.error("Erro ao atualizar configuração:", error);
    
    // Determine if this is a test
    const isTest = isTestConfiguration(configToSave);
    const prefix = isTest ? "Teste: " : "";
    
    toast.error(`${prefix}Erro ao atualizar configuração: ${error.message || "Erro desconhecido"}`);
    return null;
  }
}
