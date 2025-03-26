
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";

export const runAutoSaveTest = async (
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  setConfig: (config: ConfigCheckout) => void,
  originalConfig: ConfigCheckout
): Promise<boolean> => {
  try {
    // Make a deep copy of the original config to avoid reference issues
    const backupConfig = JSON.parse(JSON.stringify(originalConfig));
    console.log("Auto-save test: Original config backed up", backupConfig);
    
    // Set test values - these are specific values that the backend recognizes as test data
    const testConfig: ConfigCheckout = {
      ...backupConfig,
      cor_fundo: "#FF0000",
      cor_texto: "#FFFFFF",
      texto_botao: "Finalizar Compra"
    };
    
    console.log("Auto-save test: Setting test config", testConfig);
    setConfig(testConfig);
    
    // Wait a moment for state to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to save the test config
    console.log("Auto-save test: Attempting to save test config");
    const savedConfig = await handleSaveConfig();
    
    let success = false;
    
    if (!savedConfig) {
      console.error("Auto-save test: Save failed - null result");
      toast.error("Teste automático: Falha ao salvar configuração");
    } else {
      console.log("Auto-save test: Test completed successfully", savedConfig);
      success = true;
      toast.success("Teste automático: Configuração salva com sucesso");
    }
    
    // Always restore original config after test
    console.log("Auto-save test: Restoring original config after test", backupConfig);
    setTimeout(() => {
      setConfig(backupConfig);
    }, 2000);
    
    return success;
  } catch (error: any) {
    console.error("Auto-save test: Error during test", error);
    
    // If we have the original config, restore it
    if (originalConfig) {
      console.log("Auto-save test: Restoring original config after error");
      setTimeout(() => {
        setConfig(originalConfig);
      }, 1000);
    }
    
    toast.error(`Teste automático: Erro - ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    return false;
  }
};
