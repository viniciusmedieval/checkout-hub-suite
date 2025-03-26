
import { isSupabaseInitialized, getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types"; 
import { toast } from "sonner";
import { prepareConfigForSave } from "./utils/configPreparer";
import { createNewConfig } from "./operations/createConfig";
import { updateExistingConfig } from "./operations/updateConfig";

/**
 * Saves checkout configuration to the database
 */
export const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
  try {
    // For testing purposes - special handling for test values
    const isTestConfig = (
      config.cor_fundo === "#FF0000" && 
      config.cor_texto === "#FFFFFF" && 
      config.texto_botao === "Finalizar Compra"
    );

    // Verificar se o cliente Supabase está inicializado corretamente
    if (!isSupabaseInitialized()) {
      const client = await getSupabaseClient();
      if (!client) {
        const errorMsg = "Cliente Supabase não pôde ser inicializado. Verifique a conexão com o banco de dados.";
        console.error(errorMsg);
        toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
        throw new Error(errorMsg);
      }
    }

    // Simplificar teste de conexão com o Supabase
    try {
      const client = await getSupabaseClient();
      if (!client) {
        throw new Error("Cliente Supabase não está disponível");
      }
      
      // Usar uma consulta mais simples
      const { error: testError } = await client
        .from('config_checkout')
        .select('id')
        .limit(1);
        
      if (testError) {
        throw new Error(`Falha ao testar conexão: ${testError.message}`);
      }
    } catch (connError: any) {
      console.error("Falha ao testar conexão com Supabase:", connError);
      const errorMsg = `Erro de conexão com banco de dados: ${connError.message}`;
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      throw connError;
    }

    const configToSave = prepareConfigForSave(config);

    // Validar dados antes de salvar
    if (!configToSave.texto_botao || !configToSave.cor_botao) {
      const errorMsg = "Dados inválidos para salvar. Verifique os campos obrigatórios.";
      console.error(errorMsg + " Dados:", configToSave);
      toast.error(`${isTestConfig ? "Teste: " : ""}Erro: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Determinar se vamos criar ou atualizar baseado na existência de um ID
    let result: ConfigCheckout | null = null;
    
    if (config.id) {
      result = await updateExistingConfig(config, configToSave);
    } else {
      result = await createNewConfig(configToSave);
    }
    
    // Final check to ensure we're returning data
    if (result) {
      return result;
    } else {
      console.error("saveConfig: Operações de banco de dados não retornaram dados válidos");
      toast.error(`${isTestConfig ? "Teste: " : ""}Erro: Falha ao salvar configurações`);
      return null;
    }
  } catch (error: any) {
    console.error("Erro no saveConfig:", error);
    
    const isTestConfig = (
      config.cor_fundo === "#FF0000" && 
      config.cor_texto === "#FFFFFF" && 
      config.texto_botao === "Finalizar Compra"
    );
    
    toast.error(`${isTestConfig ? "Teste: " : ""}Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`);
    return null;
  }
};
