
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";

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
    
    // Create test config with our specific test values
    const testConfig = { ...currentConfig };
    testConfig.cor_fundo = "#FF0000";
    testConfig.cor_texto = "#FFFFFF";
    testConfig.texto_botao = "Finalizar Compra";
    
    console.log("🧪 Valores de teste configurados:", {
      cor_fundo: testConfig.cor_fundo,
      cor_texto: testConfig.cor_texto,
      texto_botao: testConfig.texto_botao
    });
    
    // Update the config state with test values
    setConfig(testConfig);
    
    // Execute the save function
    console.log("🔄 Executando função de salvamento...");
    const savedConfig = await saveFunction();
    
    if (savedConfig) {
      console.log("✅ Teste automático bem-sucedido! Configuração salva:", savedConfig);
      
      // Verify the test values were saved correctly
      const testPassed = 
        savedConfig.cor_fundo === "#FF0000" && 
        savedConfig.cor_texto === "#FFFFFF" && 
        savedConfig.texto_botao === "Finalizar Compra";
        
      if (testPassed) {
        console.log("✅ VALIDAÇÃO DE TESTE: Todos os valores foram salvos corretamente!");
        toast.success("Teste automático concluído com sucesso!");
        return true;
      } else {
        console.error("❌ VALIDAÇÃO DE TESTE: Valores salvos não correspondem aos valores esperados:", {
          expected: {
            cor_fundo: "#FF0000",
            cor_texto: "#FFFFFF",
            texto_botao: "Finalizar Compra"
          },
          actual: {
            cor_fundo: savedConfig.cor_fundo,
            cor_texto: savedConfig.cor_texto,
            texto_botao: savedConfig.texto_botao
          }
        });
        toast.error("Teste automático falhou: valores não correspondem!");
        return false;
      }
    } else {
      console.error("❌ Teste automático falhou: não foi possível salvar a configuração");
      toast.error("Teste automático falhou: erro ao salvar!");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro durante teste automático:", error);
    toast.error("Erro durante o teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    return false;
  }
};
