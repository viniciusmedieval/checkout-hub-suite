
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";

/**
 * Creates a new configuration in the database
 */
export async function createNewConfig(configToSave: any): Promise<ConfigCheckout | null> {
  try {
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    // Guarantee we have a valid Supabase client
    if (!client) {
      console.error("❌ Cliente Supabase não está disponível");
      throw new Error("Cliente Supabase não disponível");
    }

    // Extra debug for test values
    const isTestConfig = (
      configToSave.cor_fundo === "#FF0000" && 
      configToSave.cor_texto === "#FFFFFF" && 
      configToSave.texto_botao === "Finalizar Compra"
    );

    // Verificação de conexão simplificada
    try {
      const { error: pingError } = await client
        .from('config_checkout')
        .select('id')
        .limit(1);
        
      if (pingError) {
        console.error("❌ Erro na verificação da conexão com Supabase:", pingError);
        throw new Error(`Erro de conexão: ${pingError.message}`);
      }
    } catch (connError: any) {
      console.error("❌ Erro na verificação da conexão com Supabase:", connError);
      toast.error(`Erro de conexão: ${connError.message}`);
      throw connError;
    }

    // Insert new configuration
    const { data: insertedData, error: insertError } = await client
      .from("config_checkout")
      .insert([configToSave])
      .select("*"); // Garantir que o select seja chamado após o insert

    if (insertError) {
      console.error("❌ Erro ao criar configurações:", insertError);
      toast.error("Erro ao criar configurações: " + insertError.message);
      return null;
    }

    if (!insertedData || insertedData.length === 0) {
      console.error("❌ Erro: Retorno nulo do Supabase após inserção");
      toast.error("Erro ao recuperar dados criados. Tente novamente.");
      return null;
    }

    const processedData = ensureBooleanFields(insertedData[0]);
    
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("❌ Erro ao criar nova configuração:", error);
    toast.error("Erro ao criar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
