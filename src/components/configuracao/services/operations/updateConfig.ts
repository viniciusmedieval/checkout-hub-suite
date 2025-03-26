
import { getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { createNewConfig } from "./createConfig";

/**
 * Updates an existing configuration in the database
 */
export async function updateExistingConfig(config: ConfigCheckout, configToSave: any): Promise<ConfigCheckout | null> {
  try {
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    // Guarantee we have a valid Supabase client
    if (!client) {
      console.error("Cliente Supabase não disponível ao tentar atualizar configuração");
      throw new Error("Cliente Supabase não disponível");
    }

    // Simplificar validação de conexão
    try {
      const { error: queryError } = await client
        .from('config_checkout')
        .select('id')
        .limit(1);
      
      if (queryError) {
        console.error("Falha na verificação da conexão:", queryError);
        throw new Error(`Falha na verificação da conexão: ${queryError.message}`);
      }
    } catch (connError: any) {
      console.error("Erro na verificação da conexão com Supabase:", connError);
      toast.error(`Erro de conexão: ${connError.message}`);
      throw connError;
    }

    // Verificar se o registro existe antes de atualizar
    const { data: existingConfig, error: fetchError } = await client
      .from("config_checkout")
      .select("id")
      .eq("id", config.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Configuração com ID não encontrada ou erro ao buscar:", fetchError);
      
      if (fetchError.code === 'PGRST116') {
        // Erro de registro não encontrado, tentar criar nova configuração
        return await createNewConfig(configToSave);
      }
      
      toast.error("Erro: Configuração não encontrada para atualização.");
      return null;
    }

    // Atualizar a configuração
    const { data: updateData, error } = await client
      .from("config_checkout")
      .update(configToSave)
      .eq("id", config.id)
      .select("*");

    if (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações: " + error.message);
      return null;
    }

    if (!updateData || updateData.length === 0) {
      // Buscar os dados atualizados
      const { data, error: selectError } = await client
        .from("config_checkout")
        .select("*")
        .eq("id", config.id)
        .maybeSingle();

      if (selectError) {
        console.error("Erro ao buscar configuração atualizada:", selectError);
        toast.error("Configuração atualizada, mas houve erro ao buscar os dados atualizados.");
        return config; // Retornar a config original como feedback
      }

      if (!data) {
        console.error("Erro: Retorno nulo do Supabase após atualização");
        toast.error("Erro ao recuperar dados atualizados. Tente novamente.");
        return config; // Retornar a config original como feedback
      }
      
      const processedData = ensureBooleanFields(data);
      toast.success("Configurações salvas com sucesso!");
      return processedData;
    }

    const processedData = ensureBooleanFields(updateData[0]);
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("Erro ao atualizar configuração:", error);
    toast.error("Erro ao atualizar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
