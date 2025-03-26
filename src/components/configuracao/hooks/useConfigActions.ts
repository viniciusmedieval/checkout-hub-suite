
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
    runTestSave,
    setIsAutoTestRunning: setTestAutoRunning
  } = useTestConfig(config, setConfig, handleSaveConfig);
  
  const runAutomaticTest = useCallback(async () => {
    if (isAutoTestRunning) {
      console.log("Auto test already running, ignoring request");
      return;
    }
    
    console.log("Starting automatic test");
    setIsAutoTestRunning(true);
    setTestAutoRunning(true);
    toast.info("Iniciando teste automático...");
    
    try {
      // Make a deep copy to avoid reference issues
      const originalConfig = JSON.parse(JSON.stringify(config));
      
      console.log("Starting automatic test with config:", JSON.stringify(config));
      const testResult = await runAutoSaveTest(handleSaveConfig, setConfig, config);
      
      if (testResult) {
        toast.success("🎉 Teste automático completo!");
        
        // Reload config after successful test
        setTimeout(async () => {
          const reloadedConfig = await reloadConfig();
          if (!reloadedConfig) {
            // If reload fails, restore original config
            console.log("Reload failed, restoring original config");
            setConfig(originalConfig);
          }
          setIsAutoTestRunning(false);
          setTestAutoRunning(false);
        }, 1500);
      } else {
        console.error("Test failed");
        toast.error("❌ Teste automático falhou");
        // Restore original config
        setConfig(originalConfig);
        setIsAutoTestRunning(false);
        setTestAutoRunning(false);
      }
    } catch (error) {
      console.error("Error during automatic test:", error);
      toast.error("Erro durante teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      setIsAutoTestRunning(false);
      setTestAutoRunning(false);
    }
  }, [config, handleSaveConfig, setConfig, reloadConfig, isAutoTestRunning, setTestAutoRunning]);
  
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
