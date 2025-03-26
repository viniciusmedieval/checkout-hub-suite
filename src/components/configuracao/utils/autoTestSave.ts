
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { supabase, getSupabaseClient } from "@/lib/supabase";

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
    
    // First verify Supabase client is available
    try {
      console.log("🔄 Verificando cliente Supabase...");
      const client = await getSupabaseClient();
      if (!client) {
        throw new Error("Cliente Supabase não disponível");
      }
      console.log("✅ Cliente Supabase disponível");
      
      // Test connection with a simple query
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
    const testConfig = { ...currentConfig };
    testConfig.cor_fundo = "#FF0000";
    testConfig.cor_texto = "#FFFFFF";
    testConfig.texto_botao = "Finalizar Compra";
    
    console.log("🧪 Valores de teste configurados:");
    console.log("  cor_fundo: #FF0000 (vermelho)");
    console.log("  cor_texto: #FFFFFF (branco)");
    console.log("  texto_botao: Finalizar Compra");
    console.log("----------------------------------------------");
    
    // Update the config state with test values
    setConfig(testConfig);
    
    // Wait a moment to ensure the UI updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Execute the save function
    console.log("🔄 Executando função de salvamento...");
    
    // Add timeout to handle potential promise rejection
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout ao salvar configuração (30s)"));
      }, 30000);
    });
    
    const savedConfig = await Promise.race([
      saveFunction(),
      timeoutPromise
    ]);
    
    if (savedConfig) {
      console.log("✅ Teste automático bem-sucedido!");
      console.log("✅ Configuração salva:", savedConfig);
      console.log("----------------------------------------------");
      
      // Verify the test values were saved correctly
      const testPassed = 
        savedConfig.cor_fundo === "#FF0000" && 
        savedConfig.cor_texto === "#FFFFFF" && 
        savedConfig.texto_botao === "Finalizar Compra";
        
      if (testPassed) {
        console.log("✅ VALIDAÇÃO DE TESTE: Todos os valores foram salvos corretamente!");
        console.log("✅ cor_fundo: " + savedConfig.cor_fundo + " (esperado: #FF0000) ✓");
        console.log("✅ cor_texto: " + savedConfig.cor_texto + " (esperado: #FFFFFF) ✓");
        console.log("✅ texto_botao: " + savedConfig.texto_botao + " (esperado: Finalizar Compra) ✓");
        console.log("----------------------------------------------");
        
        toast.success("Teste automático concluído com sucesso!", {
          description: "Todos os valores foram salvos corretamente"
        });
        return true;
      } else {
        console.error("❌ VALIDAÇÃO DE TESTE: Valores salvos não correspondem aos valores esperados:");
        console.error("  Esperado:");
        console.error("    cor_fundo: #FF0000");
        console.error("    cor_texto: #FFFFFF");
        console.error("    texto_botao: Finalizar Compra");
        console.error("  Recebido:");
        console.error("    cor_fundo: " + savedConfig.cor_fundo);
        console.error("    cor_texto: " + savedConfig.cor_texto);
        console.error("    texto_botao: " + savedConfig.texto_botao);
        console.error("----------------------------------------------");
        
        toast.error("Teste automático falhou: valores não correspondem!", {
          description: "Verifique o console para detalhes"
        });
        return false;
      }
    } else {
      console.error("❌ Teste automático falhou: não foi possível salvar a configuração");
      console.error("----------------------------------------------");
      
      toast.error("Teste automático falhou: erro ao salvar!", {
        description: "Verifique o console para detalhes"
      });
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
