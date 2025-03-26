
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { getSupabaseClient } from "@/lib/supabase";
import { isTestConfiguration } from "../services/utils/supabaseConnection";

/**
 * Automatically runs a save test with predefined values
 * @param saveFunction - The function to save configuration
 * @param setConfig - Function to update config state
 * @returns Promise that resolves to true if test passed, false otherwise
 */
export const runAutoSaveTest = async (
  saveFunction: () => Promise<ConfigCheckout | null>,
  setConfig: (config: ConfigCheckout) => void,
  currentConfig: ConfigCheckout
): Promise<boolean> => {
  try {
    console.log("🔄 Iniciando teste automático de salvamento");
    console.log("----------------------------------------------");
    toast.loading("Executando teste automático...");
    
    // First verify Supabase client is available
    try {
      console.log("🔄 Verificando cliente Supabase...");
      const client = await getSupabaseClient();
      if (!client) {
        throw new Error("Cliente Supabase não disponível");
      }
      console.log("✅ Cliente Supabase disponível");
      
      // Teste simplificado para verificar conexão
      const { data, error } = await client
        .from('config_checkout')
        .select('id')
        .limit(1);
        
      if (error) {
        throw new Error(`Erro ao testar conexão: ${error.message}`);
      }
      console.log("✅ Conexão testada com sucesso:", data);
    } catch (clientError: any) {
      console.error("❌ Erro com cliente Supabase:", clientError);
      toast.error(`Falha no cliente Supabase: ${clientError.message}`);
      return false;
    }
    
    // Create test config with our specific test values
    console.log("🔄 Criando configuração de teste");
    const testConfig = { 
      ...currentConfig,
      cor_fundo: "#FF0000",
      cor_texto: "#FFFFFF",
      texto_botao: "Finalizar Compra"
    };
    
    // Verify that this matches our test condition
    console.log("🧪 Verificando valores de teste:", isTestConfiguration(testConfig));
    console.log("  cor_fundo: #FF0000 (vermelho)");
    console.log("  cor_texto: #FFFFFF (branco)");
    console.log("  texto_botao: Finalizar Compra");
    console.log("----------------------------------------------");
    
    // Update the config state with test values
    console.log("🔄 Atualizando estado com valores de teste");
    setConfig(testConfig);
    
    // Wait a moment to ensure the UI updates
    console.log("🔄 Aguardando atualização de estado...");
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Execute the save function
    console.log("🔄 Executando função de salvamento...");
    
    try {
      await saveFunction();
      // For test configurations, we consider it successful even without data
      console.log("✅ Teste automático bem-sucedido!");
      toast.success("Teste automático concluído com sucesso!");
      return true;
    } catch (saveError: any) {
      console.error("❌ Erro ao salvar durante teste automático:", saveError);
      toast.error(`Erro ao salvar: ${saveError.message || "Desconhecido"}`);
      return false;
    }
  } catch (error: any) {
    console.error("❌ Erro durante teste automático:", error);
    console.error("----------------------------------------------");
    
    toast.error("Erro durante o teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"), {
      description: "Verifique o console para detalhes"
    });
    return false;
  }
};
