
import { isSupabaseInitialized, getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types"; 
import { toast } from "sonner";
import { prepareConfigForSave } from "./utils/configPreparer";
import { createNewConfig } from "./operations/createConfig";
import { updateExistingConfig } from "./operations/updateConfig";
import { checkConnection } from "./utils/supabaseConnection";

/**
 * Checks if the config is a test configuration
 */
const isTestConfiguration = (config: ConfigCheckout): boolean => (
  config.cor_fundo === "#FF0000" && 
  config.cor_texto === "#FFFFFF" && 
  config.texto_botao === "Finalizar Compra"
);

/**
 * Validates the basic config requirements before saving
 */
const validateConfigForSave = (configToSave: any): boolean => {
  if (!configToSave.texto_botao || !configToSave.cor_botao) {
    return false;
  }
  return true;
};

/**
 * Saves checkout configuration to the database
 */
export const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
  try {
    const isTestConfig = isTestConfiguration(config);
    
    // Verify Supabase client is initialized
    if (!isSupabaseInitialized()) {
      const client = await getSupabaseClient();
      if (!client) {
        const errorMsg = "Cliente Supabase não pôde ser inicializado";
        toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
        throw new Error(errorMsg);
      }
    }

    // Test database connection
    try {
      await checkConnection();
    } catch (connError: any) {
      const errorMsg = `Erro de conexão com banco de dados: ${connError.message}`;
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      throw connError;
    }

    // Prepare the config data
    const configToSave = prepareConfigForSave(config);

    // Validate data before saving
    if (!validateConfigForSave(configToSave)) {
      const errorMsg = "Dados inválidos para salvar. Verifique os campos obrigatórios.";
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      throw new Error(errorMsg);
    }

    // Determine if we should create or update based on ID existence
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
      const errorMsg = "Falha ao salvar configurações";
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      return null;
    }
  } catch (error: any) {
    const isTestConfig = isTestConfiguration(config);
    toast.error(`${isTestConfig ? "Teste: " : ""}Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`);
    return null;
  }
};
