
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
    if (isAutoTestRunning) {
      return;
    }
    
    setIsAutoTestRunning(true);
    toast.loading("Executando teste automático...");
    
    const originalConfig = { ...config };
    
    try {
      setConfig(prev => {
        const testConfig = {
          ...prev,
          cor_fundo: "#FF0000",
          cor_texto: "#FFFFFF",
          texto_botao: "Finalizar Compra"
        };
        return testConfig;
      });
      
      setTimeout(async () => {
        try {
          const result = await handleSaveConfig();
          
          if (result) {
            toast.success("Teste automático: Configuração salva com sucesso!");
          } else {
            console.error("Teste automático falhou ao salvar: resultado nulo");
            toast.error("Teste automático: Erro ao salvar configuração");
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("Teste automático falhou com erro", error);
          toast.error("Teste automático falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          setConfig(originalConfig);
        } finally {
          setIsAutoTestRunning(false);
        }
      }, 500);
    } catch (error) {
      console.error("Erro no teste automático", error);
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
