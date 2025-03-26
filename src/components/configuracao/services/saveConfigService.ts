
import { isSupabaseInitialized } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types"; 
import { toast } from "sonner";
import { prepareConfigForSave } from "./utils/configPreparer";
import { createNewConfig } from "./operations/createConfig";
import { updateExistingConfig } from "./operations/updateConfig";
import { supabase } from "@/lib/supabase";

/**
 * Saves checkout configuration to the database
 */
export const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
  try {
    console.log("🔄 Iniciando saveConfig com dados:", config);
    
    // For testing purposes - special handling for test values
    const isTestConfig = (
      config.cor_fundo === "#FF0000" && 
      config.cor_texto === "#FFFFFF" && 
      config.texto_botao === "Finalizar Compra"
    );
    
    if (isTestConfig) {
      console.log("🧪 TESTE AUTOMÁTICO: Valores de teste detectados");
      console.log(`cor_fundo: ${config.cor_fundo} (esperado: #FF0000) ✓`);
      console.log(`cor_texto: ${config.cor_texto} (esperado: #FFFFFF) ✓`);
      console.log(`texto_botao: ${config.texto_botao} (esperado: Finalizar Compra) ✓`);
    }

    // Verificar se o cliente Supabase está inicializado corretamente
    if (!isSupabaseInitialized() || !supabase) {
      const errorMsg = "Cliente Supabase não inicializado. Verifique a conexão com o banco de dados.";
      console.error("❌ " + errorMsg);
      
      if (isTestConfig) {
        console.error("🧪 TESTE AUTOMÁTICO FALHOU: " + errorMsg);
      }
      
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      throw new Error(errorMsg);
    }

    // Test Supabase connection explicitly
    try {
      console.log("🔄 Testando conexão com o Supabase antes de salvar...");
      const { data: testData, error: testError } = await supabase
        .from('config_checkout')
        .select('count(*)', { count: 'exact' })
        .limit(1);
        
      if (testError) {
        throw new Error(`Falha ao testar conexão: ${testError.message}`);
      }
      console.log("✅ Conexão com Supabase testada com sucesso");
    } catch (connError: any) {
      console.error("❌ Falha ao testar conexão com Supabase:", connError);
      
      if (isTestConfig) {
        console.error("🧪 TESTE AUTOMÁTICO FALHOU: Erro de conexão");
      }
      
      const errorMsg = `Erro de conexão com banco de dados: ${connError.message}`;
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      throw connError;
    }

    const configToSave = prepareConfigForSave(config);

    // Try to use the edge function for saving the config
    try {
      console.log("🔄 Tentando usar Edge Function para salvar configuração");
      const response = await supabase.functions.invoke('save-config', {
        body: configToSave
      });

      console.log("Edge function response:", response);
      
      if (response.error) {
        console.error("❌ Erro na Edge Function:", response.error);
        
        if (isTestConfig) {
          console.error("🧪 TESTE AUTOMÁTICO FALHOU: Erro na Edge Function");
        }
        
        toast.error(`${isTestConfig ? "Teste: " : ""}Erro ao salvar: ${response.error.message || "Falha na comunicação com o servidor"}`);
        throw new Error(response.error.message || "Erro ao salvar via Edge Function");
      }

      if (response.data && response.data.success) {
        console.log("✅ Configuração salva com sucesso via Edge Function:", response.data.data);
        
        if (isTestConfig) {
          console.log("🧪 TESTE AUTOMÁTICO CONCLUÍDO COM SUCESSO (via Edge Function)! ✅");
        }
        
        toast.success(response.data.message || "Configurações salvas com sucesso!");
        
        // Return the first item if we got an array
        const savedConfig = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        return savedConfig;
      } else if (response.data && response.data.error) {
        // Handle error in response data
        console.error("❌ Erro retornado pela Edge Function:", response.data.message);
        
        if (isTestConfig) {
          console.error("🧪 TESTE AUTOMÁTICO FALHOU: " + response.data.message);
        }
        
        toast.error(`${isTestConfig ? "Teste: " : ""}Erro ao salvar: ${response.data.message || "Erro desconhecido"}`);
        throw new Error(response.data.message || "Erro desconhecido na Edge Function");
      } else {
        console.error("❌ Resposta da Edge Function sem dados de sucesso:", response);
        
        if (isTestConfig) {
          console.error("🧪 TESTE AUTOMÁTICO FALHOU: Resposta inválida");
        }
        
        toast.error(`${isTestConfig ? "Teste: " : ""}Resposta inválida do servidor. Tente novamente mais tarde.`);
        throw new Error("Resposta inválida da Edge Function");
      }
    } catch (edgeFuncError) {
      // Log error but continue with fallback method
      console.error("❌ Falha ao salvar via Edge Function, usando método direto:", edgeFuncError);
      toast.warning(`${isTestConfig ? "Teste: " : ""}Tentando método alternativo de salvamento...`);
    }

    // Validar dados antes de salvar no método de fallback
    if (!configToSave.texto_botao || !configToSave.cor_botao) {
      const errorMsg = "Dados inválidos para salvar. Verifique os campos obrigatórios.";
      console.error("❌ " + errorMsg + " Dados:", configToSave);
      
      if (isTestConfig) {
        console.error("🧪 TESTE AUTOMÁTICO FALHOU: " + errorMsg);
      }
      
      toast.error(`${isTestConfig ? "Teste: " : ""}Erro: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Fallback: use direct database access if edge function fails
    console.log("🔄 Usando método direto para salvar configuração");
    
    // Determinar se vamos criar ou atualizar baseado na existência de um ID
    if (config.id) {
      return await updateExistingConfig(config, configToSave);
    } else {
      return await createNewConfig(configToSave);
    }
  } catch (error: any) {
    console.error("❌ Erro no saveConfig:", error);
    
    const isTestConfig = (
      config.cor_fundo === "#FF0000" && 
      config.cor_texto === "#FFFFFF" && 
      config.texto_botao === "Finalizar Compra"
    );
    
    if (isTestConfig) {
      console.error("🧪 TESTE AUTOMÁTICO FALHOU: " + (error.message || "Erro desconhecido"));
    }
    
    toast.error(`${isTestConfig ? "Teste: " : ""}Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`);
    return null;
  }
};
