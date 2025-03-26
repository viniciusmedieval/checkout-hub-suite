
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { performDatabaseOperation } from "../utils/supabaseConnection";

/**
 * Creates a new configuration in the database
 */
export async function createNewConfig(configToSave: any): Promise<ConfigCheckout | null> {
  try {
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    if (!client) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Insert new configuration
    const insertOperation = async () => {
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
      "Erro ao criar configurações"
    );
    
    if (!data) {
      return null;
    }

    const processedData = ensureBooleanFields(data);
    
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("Erro ao criar nova configuração:", error);
    toast.error("Erro ao criar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
