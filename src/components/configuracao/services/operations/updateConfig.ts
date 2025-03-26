
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { performDatabaseOperation, isTestConfiguration } from "../utils/supabaseConnection";

/**
 * Updates an existing configuration in the database
 */
export const updateExistingConfig = async (
  config: ConfigCheckout,
  configToSave: any
): Promise<ConfigCheckout | null> => {
  try {
    // Check if this is a test configuration
    const isTest = isTestConfiguration(config);
    
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    if (!client) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Update existing configuration
    const updateOperation = async () => {
      if (isTest) {
        console.log("Executando operação de teste (update) com valores:", configToSave);
        
        // For test configurations, we simulate a successful response
        // instead of actually updating the database
        return {
          ...configToSave,
          criado_em: new Date().toISOString()
        };
      }
      
      const { data: updatedData, error: updateError } = await client
        .from("config_checkout")
        .update(configToSave)
        .eq("id", config.id)
        .select("*");

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (!updatedData || updatedData.length === 0) {
        throw new Error("Retorno nulo do Supabase após atualização");
      }

      return updatedData[0];
    };

    const data = await performDatabaseOperation(
      updateOperation, 
      "Erro ao atualizar configurações",
      isTest
    );
    
    if (!data) {
      // For test configuration, show a success message even if data is null
      if (isTest) {
        toast.success("Teste: Configurações salvas com sucesso!");
        return config;
      }
      return null;
    }

    const processedData = ensureBooleanFields(data);
    
    if (isTest) {
      toast.success("Teste: Configurações atualizadas com sucesso!");
    } else {
      toast.success("Configurações atualizadas com sucesso!");
    }
    
    return processedData;
  } catch (error: any) {
    console.error("Erro ao atualizar configuração existente:", error);
    
    // Determine if this is a test
    const isTest = isTestConfiguration(config);
    
    // For test configurations, we still want to return a success result
    if (isTest) {
      console.log("Ignorando erro em configuração de teste, retornando mock");
      toast.success("Teste: Simulação de atualização bem-sucedida");
      return {
        ...config,
        ...configToSave,
        criado_em: config.criado_em || new Date().toISOString()
      } as ConfigCheckout;
    }
    
    const prefix = isTest ? "Teste: " : "";
    toast.error(`${prefix}Erro ao atualizar configuração: ${error.message || "Erro desconhecido"}`);
    return null;
  }
};
