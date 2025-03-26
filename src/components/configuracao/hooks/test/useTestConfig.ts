
import { useState, useCallback } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";

export const useTestConfig = (
  config: ConfigCheckout,
  setConfig: React.Dispatch<React.SetStateAction<ConfigCheckout>>,
  handleSaveConfig: () => Promise<ConfigCheckout | null>
) => {
  const [isTestSaving, setIsTestSaving] = useState(false);
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);

  const runTestSave = useCallback(async () => {
    if (isTestSaving) {
      return;
    }
    
    setIsTestSaving(true);
    toast.loading("Executando teste de salvamento...");
    
    // Save original config before modifying
    const originalConfig = { ...config };
    
    try {
      console.log("Running test save with original config:", JSON.stringify(originalConfig));
      
      // Atualizar a configuração com valores de teste
      const testConfig = {
        ...originalConfig,
        cor_fundo: "#FF0000",
        cor_texto: "#FFFFFF",
        texto_botao: "Finalizar Compra"
      };
      
      console.log("Setting test config:", JSON.stringify(testConfig));
      setConfig(testConfig);

      // Adicionando um pequeno atraso para garantir que o estado seja atualizado
      setTimeout(async () => {
        try {
          console.log("Attempting to save test config");
          const savedConfig = await handleSaveConfig();
          
          if (savedConfig) {
            console.log("Test save successful:", JSON.stringify(savedConfig));
            toast.success("Teste: Configuração salva com sucesso!");
          } else {
            console.error("Test failed: null result from handleSaveConfig");
            toast.error("Teste: Erro ao salvar configuração - resultado nulo");
            // Restore original config
            console.log("Restoring original config after test failure");
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("Test save failed with error:", error);
          toast.error("Teste falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          // Restore original config
          console.log("Restoring original config after test error");
          setConfig(originalConfig);
        } finally {
          setIsTestSaving(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error setting up test:", error);
      toast.error("Erro ao executar teste: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      // Restore original config
      console.log("Restoring original config after setup error");
      setConfig(originalConfig);
      setIsTestSaving(false);
    }
  }, [config, setConfig, handleSaveConfig, isTestSaving]);

  return {
    isTestSaving,
    isAutoTestRunning,
    runTestSave,
    setIsAutoTestRunning
  };
};
