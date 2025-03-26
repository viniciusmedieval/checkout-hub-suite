
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

  console.log("🔄 useConfigActions hook inicializado", { 
    configId: config?.id, 
    hasUnsavedChanges: hasUnsavedChanges() 
  });

  const onSaveClick = useCallback(async () => {
    console.log("🔄 onSaveClick iniciado");
    
    // Verificar se há alterações para salvar
    if (!hasUnsavedChanges()) {
      console.log("ℹ️ Sem alterações para salvar");
      toast.info("Não há alterações para salvar");
      return;
    }

    try {
      setIsSaveAttempted(true);
      console.log("🔄 Tentando salvar configuração...");
      
      const result = await handleSaveConfig();
      
      if (result) {
        console.log("✅ Configuração salva com sucesso:", result);
        setSaveSuccess(true);
        toast.success("Configurações salvas com sucesso!");
      } else {
        console.error("❌ Erro ao salvar configurações: resultado nulo");
        toast.error("Erro ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("❌ Exceção ao salvar configurações:", error);
      toast.error("Erro ao salvar: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      console.log("🔄 Finalizando tentativa de salvamento");
      setTimeout(() => {
        setIsSaveAttempted(false);
        // Resetar o estado de sucesso após alguns segundos
        if (saveSuccess) {
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }, 1000);
    }
  }, [hasUnsavedChanges, handleSaveConfig, saveSuccess]);

  const runTestSave = useCallback(async () => {
    console.log("🔄 runTestSave iniciado");
    setIsTestSaving(true);
    
    try {
      console.log("🔄 Iniciando teste automático de salvamento de configuração");
      console.log("🧪 Valores de teste configurados:");
      console.log("  cor_fundo: #FF0000 (vermelho)");
      console.log("  cor_texto: #FFFFFF (branco)");
      console.log("  texto_botao: Finalizar Compra");

      // Backup original config
      const originalConfig = { ...config };
      console.log("🔄 Backup da configuração original criado");

      // Set test values
      console.log("🔄 Definindo valores de teste na configuração");
      setConfig(prevConfig => {
        const testConfig = {
          ...prevConfig,
          cor_fundo: "#FF0000",
          cor_texto: "#FFFFFF",
          texto_botao: "Finalizar Compra",
        };
        console.log("🔄 Nova configuração de teste:", testConfig);
        return testConfig;
      });

      // Use setTimeout to ensure state has updated before saving
      setTimeout(async () => {
        try {
          console.log("🔄 Tentando salvar configuração de teste...");
          const savedConfig = await handleSaveConfig();
          
          if (savedConfig) {
            console.log("✅ Teste automático - Configuração salva com sucesso:", savedConfig);
            toast.success("Teste: Configuração salva com sucesso!");
            setIsSaveAttempted(true);
            setSaveSuccess(true);
            
            // Resetar estados após alguns segundos
            setTimeout(() => {
              setIsSaveAttempted(false);
              setSaveSuccess(false);
            }, 3000);
          } else {
            console.error("❌ Teste falhou ao salvar configuração: resultado nulo");
            toast.error("Teste: Erro ao salvar configuração");
            
            // Restore original config
            console.log("🔄 Restaurando configuração original após falha");
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste falhou com erro", error);
          toast.error("Teste falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          
          // Restore original config
          console.log("🔄 Restaurando configuração original após erro");
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
    console.log("🔄 runAutomaticTest iniciado");
    setIsAutoTestRunning(true);
    
    try {
      console.log("🔄 Iniciando teste de configuração automático");
      
      // Backup original config
      const originalConfig = { ...config };
      console.log("🔄 Backup da configuração original criado");
      
      // Set test values
      console.log("🔄 Definindo valores de teste na configuração");
      setConfig(prev => {
        const testConfig = {
          ...prev,
          cor_fundo: "#FF0000",
          cor_texto: "#FFFFFF",
          texto_botao: "Finalizar Compra"
        };
        console.log("🔄 Nova configuração de teste:", testConfig);
        return testConfig;
      });
      
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
            
            // Resetar estados após alguns segundos
            setTimeout(() => {
              setIsSaveAttempted(false);
              setSaveSuccess(false);
            }, 3000);
          } else {
            console.error("❌ Teste automático falhou ao salvar: resultado nulo");
            toast.error("Teste automático: Erro ao salvar configuração");
            
            // Restore original config
            console.log("🔄 Restaurando configuração original após falha");
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste automático falhou com erro", error);
          toast.error("Teste automático falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          
          // Restore original config
          console.log("🔄 Restaurando configuração original após erro");
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
