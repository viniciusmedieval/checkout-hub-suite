
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
    
    // For testing purposes - log our specific test values
    console.log("🧪 Valores de teste:");
    console.log(`cor_fundo: ${config.cor_fundo} (esperado: #FF0000)`);
    console.log(`cor_texto: ${config.cor_texto} (esperado: #FFFFFF)`);
    console.log(`texto_botao: ${config.texto_botao} (esperado: Finalizar Compra)`);

    // Verificar se o cliente Supabase está inicializado corretamente
    if (!isSupabaseInitialized() || !supabase) {
      console.error("❌ Cliente Supabase não inicializado. Salvando na localStorage como fallback.");
      
      // Fallback: salvar no localStorage se o Supabase não estiver disponível
      try {
        localStorage.setItem('fallbackConfig', JSON.stringify(config));
        toast.warning("Configurações salvas localmente. Conecte-se ao Supabase para persistência completa.");
        return config; // Retornar a config original como feedback para o usuário
      } catch (localError) {
        console.error("❌ Falha ao salvar no localStorage:", localError);
        toast.error("Erro: Falha ao salvar configurações localmente.");
        return null;
      }
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
        toast.error(`Erro ao salvar: ${response.error.message || "Falha na comunicação com o servidor"}`);
        throw new Error(response.error.message || "Erro ao salvar via Edge Function");
      }

      if (response.data && response.data.success) {
        console.log("✅ Configuração salva com sucesso via Edge Function:", response.data.data);
        toast.success(response.data.message || "Configurações salvas com sucesso!");
        
        // Return the first item if we got an array
        const savedConfig = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        return savedConfig;
      } else if (response.data && response.data.error) {
        // Handle error in response data
        console.error("❌ Erro retornado pela Edge Function:", response.data.message);
        toast.error(`Erro ao salvar: ${response.data.message || "Erro desconhecido"}`);
        throw new Error(response.data.message || "Erro desconhecido na Edge Function");
      } else {
        console.error("❌ Resposta da Edge Function sem dados de sucesso:", response);
        toast.error("Resposta inválida do servidor. Tente novamente mais tarde.");
        throw new Error("Resposta inválida da Edge Function");
      }
    } catch (edgeFuncError) {
      // Log error but continue with fallback method
      console.error("❌ Falha ao salvar via Edge Function, usando método direto:", edgeFuncError);
      toast.warning("Tentando método alternativo de salvamento...");
    }

    // Validar dados antes de salvar no método de fallback
    if (!configToSave.texto_botao || !configToSave.cor_botao) {
      console.error("❌ Dados inválidos para salvar:", configToSave);
      toast.error("Erro: Dados inválidos para salvar. Verifique os campos obrigatórios.");
      return null;
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
    toast.error("Erro ao salvar configurações: " + (error.message || "Erro desconhecido"));
    return null;
  }
};
