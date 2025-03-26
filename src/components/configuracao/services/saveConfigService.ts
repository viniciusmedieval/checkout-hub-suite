
import { supabase, isSupabaseInitialized, getSupabaseClient } from "@/lib/supabase";
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
    if (!isSupabaseInitialized()) {
      console.log("⚠️ Cliente Supabase não inicializado. Tentando inicializar...");
      const client = await getSupabaseClient();
      if (!client) {
        const errorMsg = "Cliente Supabase não pôde ser inicializado. Verifique a conexão com o banco de dados.";
        console.error("❌ " + errorMsg);
        
        if (isTestConfig) {
          console.error("🧪 TESTE AUTOMÁTICO FALHOU: " + errorMsg);
        }
        
        toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
        throw new Error(errorMsg);
      }
      console.log("✅ Cliente Supabase inicializado com sucesso:", client);
    }

    // Simplificar teste de conexão com o Supabase
    try {
      console.log("🔄 Testando conexão com o Supabase antes de salvar...");
      const client = await getSupabaseClient();
      if (!client) {
        throw new Error("Cliente Supabase não está disponível");
      }
      
      // Usar uma consulta mais simples
      const { data: testData, error: testError } = await client
        .from('config_checkout')
        .select('id')
        .limit(1);
        
      if (testError) {
        throw new Error(`Falha ao testar conexão: ${testError.message}`);
      }
      console.log("✅ Conexão com Supabase testada com sucesso", testData);
    } catch (connError: any) {
      console.error("❌ Falha ao testar conexão com Supabase:", connError);
      console.error("Detalhes do erro:", connError);
      
      if (isTestConfig) {
        console.error("🧪 TESTE AUTOMÁTICO FALHOU: Erro de conexão");
      }
      
      const errorMsg = `Erro de conexão com banco de dados: ${connError.message}`;
      toast.error(isTestConfig ? "Teste: " + errorMsg : errorMsg);
      throw connError;
    }

    const configToSave = prepareConfigForSave(config);
    console.log("🔄 Configuração preparada para salvar:", configToSave);

    // Validar dados antes de salvar
    if (!configToSave.texto_botao || !configToSave.cor_botao) {
      const errorMsg = "Dados inválidos para salvar. Verifique os campos obrigatórios.";
      console.error("❌ " + errorMsg + " Dados:", configToSave);
      
      if (isTestConfig) {
        console.error("🧪 TESTE AUTOMÁTICO FALHOU: " + errorMsg);
      }
      
      toast.error(`${isTestConfig ? "Teste: " : ""}Erro: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Determinar se vamos criar ou atualizar baseado na existência de um ID
    let result: ConfigCheckout | null = null;
    
    if (config.id) {
      console.log("🔄 ID encontrado, atualizando configuração existente:", config.id);
      result = await updateExistingConfig(config, configToSave);
    } else {
      console.log("🔄 ID não encontrado, criando nova configuração");
      result = await createNewConfig(configToSave);
    }
    
    // Final check to ensure we're returning data
    if (result) {
      console.log("✅ saveConfig concluído com sucesso, retornando:", result);
      return result;
    } else {
      console.error("❌ saveConfig: Operações de banco de dados não retornaram dados válidos");
      
      if (isTestConfig) {
        console.error("🧪 TESTE AUTOMÁTICO FALHOU: Operações de banco retornaram nulo");
      }
      
      toast.error(`${isTestConfig ? "Teste: " : ""}Erro: Falha ao salvar configurações`);
      return null;
    }
  } catch (error: any) {
    console.error("❌ Erro no saveConfig:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "Sem stack trace");
    
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
