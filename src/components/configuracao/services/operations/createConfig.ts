
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { performDatabaseOperation, isTestConfiguration } from "../utils/supabaseConnection";

/**
 * Creates a new configuration in the database
 */
export async function createNewConfig(configToSave: any): Promise<ConfigCheckout | null> {
  try {
    // Check if this is a test configuration
    const isTest = isTestConfiguration(configToSave);
    
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    if (!client) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Insert new configuration
    const insertOperation = async () => {
      if (isTest) {
        console.log("Executando operação de teste (create) com valores:", configToSave);
        
        // For test configurations, we simulate a successful response
        // instead of actually inserting into the database
        return {
          ...configToSave,
          id: 999, // Mock ID for test
          criado_em: new Date().toISOString()
        };
      }
      
      const { data: insertedData, error: insertError } = await client
        .from("config_checkout")
        .insert([configToSave])
        .select("*");

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (!insertedData || insertedData.length === 0) {
        throw new Error("Retorno nulo do Supabase após inserção");
      }

      return insertedData[0];
    };

    const data = await performDatabaseOperation(
      insertOperation, 
      "Erro ao criar configurações",
      isTest
    );
    
    if (!data) {
      // For test configuration, show a success message even if data is null
      if (isTest) {
        toast.success("Teste: Configurações salvas com sucesso!");
        return configToSave as ConfigCheckout;
      }
      return null;
    }

    const processedData = ensureBooleanFields(data);
    
    if (isTest) {
      toast.success("Teste: Configurações salvas com sucesso!");
    } else {
      toast.success("Configurações salvas com sucesso!");
    }
    
    return processedData;
  } catch (error: any) {
    console.error("Erro ao criar nova configuração:", error);
    
    // Determine if this is a test
    const isTest = isTestConfiguration(configToSave);
    const prefix = isTest ? "Teste: " : "";
    
    toast.error(`${prefix}Erro ao criar configuração: ${error.message || "Erro desconhecido"}`);
    return null;
  }
}
