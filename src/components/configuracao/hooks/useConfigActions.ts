
import { useState, useCallback } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { useSaveConfig } from "./save/useSaveConfig";
import { useTestConfig } from "./test/useTestConfig";
import { runAutoSaveTest } from "../utils/autoTestSave";

export const useConfigActions = (
  config: ConfigCheckout,
  setConfig: (config: ConfigCheckout) => void,
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  hasUnsavedChanges: () => boolean,
  reloadConfig: () => Promise<ConfigCheckout | null>
) => {
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);
  
  const {
    isSaveAttempted,
    saveSuccess,
    onSaveClick
  } = useSaveConfig(config, handleSaveConfig, hasUnsavedChanges);
  
  const {
    isTestSaving,
    runTestSave
  } = useTestConfig(config, setConfig, handleSaveConfig);
  
  const runAutomaticTest = useCallback(async () => {
    if (isAutoTestRunning) return;
    
    setIsAutoTestRunning(true);
    toast.info("Iniciando teste automático...");
    
    try {
      const testResult = await runAutoSaveTest(handleSaveConfig, setConfig, config);
      
      if (testResult) {
        toast.success("🎉 Teste automático completo!");
        
        // Reload config after successful test
        setTimeout(async () => {
          await reloadConfig();
          setIsAutoTestRunning(false);
        }, 1000);
      } else {
        toast.error("❌ Teste automático falhou");
        setIsAutoTestRunning(false);
      }
    } catch (error) {
      console.error("Error during automatic test:", error);
      toast.error("Erro durante teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      setIsAutoTestRunning(false);
    }
  }, [config, handleSaveConfig, setConfig, reloadConfig, isAutoTestRunning]);
  
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
