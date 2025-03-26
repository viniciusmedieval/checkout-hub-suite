
import { useState, useCallback } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";

export const useConfigActions = (
  config: ConfigCheckout,
  setConfig: React.Dispatch<React.SetStateAction<ConfigCheckout>>,
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  hasUnsavedChanges: () => boolean,
  reloadConfig: () => Promise<ConfigCheckout | null>
) => {
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestSaving, setIsTestSaving] = useState(false);
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);

  const onSaveClick = useCallback(async () => {
    if (!hasUnsavedChanges()) {
      toast.info("Não há alterações para salvar");
      return;
    }

    setIsSaveAttempted(true);
    const result = await handleSaveConfig();
    setSaveSuccess(!!result);
    
    if (result) {
      toast.success("Configurações salvas com sucesso!");
    } else {
      toast.error("Erro ao salvar configurações. Tente novamente.");
    }
  }, [hasUnsavedChanges, handleSaveConfig]);

  const runTestSave = useCallback(async () => {
    setIsTestSaving(true);
    try {
      console.log("🔄 Iniciando teste automático de salvamento de configuração");
      console.log("🧪 Valores de teste configurados:");
      console.log("  cor_fundo: #FF0000 (vermelho)");
      console.log("  cor_texto: #FFFFFF (branco)");
      console.log("  texto_botao: Finalizar Compra");

      // Backup original config
      const originalConfig = { ...config };

      // Set test values
      setConfig(prevConfig => ({
        ...prevConfig,
        cor_fundo: "#FF0000",
        cor_texto: "#FFFFFF",
        texto_botao: "Finalizar Compra",
      }));

      // Try to save directly - this might fail if we don't wait for state to update
      try {
        const savedConfig = await handleSaveConfig();
        if (savedConfig) {
          console.log("✅ Teste automático - Configuração salva com sucesso:", savedConfig);
          toast.success("Teste: Configuração salva com sucesso!");
          setIsSaveAttempted(true);
          setSaveSuccess(true);
          return;
        }
      } catch (error) {
        console.error("❌ Não foi possível salvar a configuração de teste diretamente", error);
      }

      // If direct save fails, we need to wait for state update and try again
      console.log("🔄 Iniciando teste automático de salvamento");
      console.log("----------------------------------------------");
      
      // This will happen on the next render after state update
      setTimeout(async () => {
        try {
          const result = await handleSaveConfig();
          if (result) {
            console.log("✅ Teste concluído com sucesso!");
            toast.success("Teste: Configuração salva com sucesso!");
            setIsSaveAttempted(true);
            setSaveSuccess(true);
          } else {
            console.error("❌ Teste falhou ao salvar configuração");
            toast.error("Teste: Erro ao salvar configuração");
            
            // Restore original config
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste falhou com erro", error);
          toast.error("Teste falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          
          // Restore original config
          setConfig(originalConfig);
        } finally {
          setIsTestSaving(false);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Erro ao executar teste", error);
      toast.error("Erro ao executar teste: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      setIsTestSaving(false);
    }
  }, [config, setConfig, handleSaveConfig]);

  const runAutomaticTest = useCallback(async () => {
    setIsAutoTestRunning(true);
    try {
      console.log("🔄 Iniciando teste de configuração automático");
      
      // Backup original config
      const originalConfig = { ...config };
      
      // Set test values
      setConfig(prev => ({
        ...prev,
        cor_fundo: "#FF0000",
        cor_texto: "#FFFFFF",
        texto_botao: "Finalizar Compra"
      }));
      
      // Wait for state update
      setTimeout(async () => {
        try {
          console.log("🔄 Estado atualizado, tentando salvar configuração de teste");
          const result = await handleSaveConfig();
          
          if (result) {
            console.log("✅ Teste automático concluído com sucesso!", result);
            toast.success("Teste automático: Configuração salva com sucesso!");
            setIsSaveAttempted(true);
            setSaveSuccess(true);
          } else {
            console.error("❌ Teste automático falhou ao salvar");
            toast.error("Teste automático: Erro ao salvar configuração");
            
            // Restore original config
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste automático falhou com erro", error);
          toast.error("Teste automático falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          
          // Restore original config
          setConfig(originalConfig);
        } finally {
          setIsAutoTestRunning(false);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Erro no teste automático", error);
      toast.error("Erro no teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      setIsAutoTestRunning(false);
    }
  }, [config, setConfig, handleSaveConfig]);

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
