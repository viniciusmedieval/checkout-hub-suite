
// src/components/configuracao/services/saveConfigService.ts
import { isSupabaseInitialized } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types"; // Import from database-types
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

    // Validar dados antes de salvar
    if (!configToSave.texto_botao || !configToSave.cor_botao) {
      console.error("❌ Dados inválidos para salvar:", configToSave);
      toast.error("Erro: Dados inválidos para salvar. Verifique os campos obrigatórios.");
      return null;
    }

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
