
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";

export const runAutoSaveTest = async (
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  setConfig: (config: ConfigCheckout) => void,
  originalConfig: ConfigCheckout
): Promise<boolean> => {
  try {
    // Save the original config for restoration later
    const backupConfig = { ...originalConfig };
    console.log("Auto-save test: Original config backed up", backupConfig);
    
    // Set test values
    const testConfig: ConfigCheckout = {
      ...backupConfig,
      cor_fundo: "#FF0000",
      cor_texto: "#FFFFFF",
      texto_botao: "Finalizar Compra"
    };
    
    console.log("Auto-save test: Setting test config", testConfig);
    setConfig(testConfig);
    
    // Wait a moment for state to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to save the test config
    console.log("Auto-save test: Attempting to save test config");
    const savedConfig = await handleSaveConfig();
    
    if (!savedConfig) {
      console.error("Auto-save test: Save failed - null result");
      toast.error("Teste automático: Falha ao salvar configuração");
      
      // Restore original config
      console.log("Auto-save test: Restoring original config after failure");
      setConfig(backupConfig);
      return false;
    }
    
    console.log("Auto-save test: Test completed successfully", savedConfig);
    return true;
  } catch (error) {
    console.error("Auto-save test: Error during test", error);
    
    // If we have the original config, restore it
    if (originalConfig) {
      console.log("Auto-save test: Restoring original config after error");
      setConfig(originalConfig);
    }
    
    toast.error(`Teste automático: Erro - ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    return false;
  }
};
