
import { useCallback } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { useSaveConfig } from "./save/useSaveConfig";
import { useTestConfig } from "./test/useTestConfig";

export const useConfigActions = (
  config: ConfigCheckout,
  setConfig: React.Dispatch<React.SetStateAction<ConfigCheckout>>,
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  hasUnsavedChanges: () => boolean,
  reloadConfig: () => Promise<ConfigCheckout | null>
) => {
  const { isSaveAttempted, saveSuccess, onSaveClick } = useSaveConfig(
    config,
    handleSaveConfig,
    hasUnsavedChanges
  );

  const { isTestSaving, isAutoTestRunning, runTestSave, setIsAutoTestRunning } = useTestConfig(
    config,
    setConfig,
    handleSaveConfig
  );

  const runAutomaticTest = useCallback(async () => {
    console.log("🔄 runAutomaticTest iniciado");
    
    if (isAutoTestRunning) {
      console.log("ℹ️ Teste automático já em andamento");
      return;
    }
    
    setIsAutoTestRunning(true);
    toast.loading("Executando teste automático...");
    
    const originalConfig = { ...config };
    console.log("🔄 Config original (antes do teste):", originalConfig);
    
    try {
      console.log("🔄 Definindo valores de teste:");
      console.log("  - cor_fundo: #FF0000");
      console.log("  - cor_texto: #FFFFFF");
      console.log("  - texto_botao: Finalizar Compra");
      
      setConfig(prev => {
        const testConfig = {
          ...prev,
          cor_fundo: "#FF0000",
          cor_texto: "#FFFFFF",
          texto_botao: "Finalizar Compra"
        };
        console.log("🔄 Config de teste definida:", testConfig);
        return testConfig;
      });
      
      setTimeout(async () => {
        try {
          console.log("🔄 Preparando para chamar handleSaveConfig com a config de teste");
          console.log("🔄 Estado atual da config:", config);
          
          const result = await handleSaveConfig();
          console.log("DEBUG valor de result:", result);
          
          if (result) {
            console.log("✅ Teste automático concluído com sucesso!", result);
            toast.success("Teste automático: Configuração salva com sucesso!");
          } else {
            console.error("❌ Teste automático falhou ao salvar: resultado nulo");
            console.error("Verificar logs do serviço de salvamento para mais detalhes");
            toast.error("Teste automático: Erro ao salvar configuração");
            console.log("🔄 Restaurando config original:", originalConfig);
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste automático falhou com erro", error);
          console.error("Stack trace:", error instanceof Error ? error.stack : "Sem stack trace");
          toast.error("Teste automático falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          console.log("🔄 Restaurando config original após erro:", originalConfig);
          setConfig(originalConfig);
        } finally {
          setIsAutoTestRunning(false);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Erro no teste automático", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : "Sem stack trace");
      toast.error("Erro no teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      setIsAutoTestRunning(false);
    }
  }, [config, setConfig, handleSaveConfig, isAutoTestRunning, setIsAutoTestRunning]);

  return {
    isSaveAttempted,
    saveSuccess,
    isTestSaving,
    isAutoTestRunning,
    onSaveClick,
    runTestSave,
    runAutomaticTest
  };
};
