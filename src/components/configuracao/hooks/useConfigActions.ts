
import { useState } from "react";
import { toast } from "sonner";
import { ConfigCheckout } from "@/lib/types/database-types";
import { runAutoSaveTest } from "@/components/configuracao/utils/autoTestSave";

export function useConfigActions(
  config: ConfigCheckout,
  setConfig: (config: ConfigCheckout) => void,
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  hasUnsavedChanges: () => boolean,
  reloadConfig: () => Promise<ConfigCheckout | null>
) {
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestSaving, setIsTestSaving] = useState(false);
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);

  const onSaveClick = async () => {
    setIsSaveAttempted(true);
    setSaveSuccess(false);
    
    if (!hasUnsavedChanges()) {
      toast.info("Não há alterações para salvar");
      setIsSaveAttempted(false);
      return;
    }
    
    console.log("Saving configuration...", config);
    
    try {
      const savedConfig = await handleSaveConfig();
      
      if (savedConfig) {
        console.log("Configuration saved successfully:", savedConfig);
        await reloadConfig();
        setSaveSuccess(true);
        toast.success("Configurações salvas com sucesso!");
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("Failed to save configuration");
        toast.error("Falha ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Erro ao salvar configurações: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsSaveAttempted(false);
    }
  };

  const runTestSave = async () => {
    setIsTestSaving(true);
    const testConfig = { ...config };
    
    testConfig.cor_fundo = "#FF0000";
    testConfig.cor_texto = "#FFFFFF";
    testConfig.texto_botao = "Finalizar Compra";
    
    console.log("🧪 Executando teste de salvamento com valores específicos:", testConfig);
    
    setConfig(testConfig);
    
    try {
      const savedConfig = await handleSaveConfig();
      
      if (savedConfig) {
        console.log("🧪 Teste de configuração salvo com sucesso:", savedConfig);
        await reloadConfig();
        setSaveSuccess(true);
        toast.success("Teste: Configurações salvas com sucesso!");
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("🧪 Falha no teste de salvamento de configuração");
        toast.error("Teste: Falha ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("🧪 Erro no teste de salvamento:", error);
      toast.error("Teste: Erro ao salvar configurações: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsTestSaving(false);
    }
  };

  const runAutomaticTest = async () => {
    setIsAutoTestRunning(true);
    console.log("🔄 Iniciando teste automático de salvamento de configuração");
    
    try {
      const testConfig = { ...config };
      testConfig.cor_fundo = "#FF0000";
      testConfig.cor_texto = "#FFFFFF";
      testConfig.texto_botao = "Finalizar Compra";
      
      console.log("🧪 Valores de teste configurados:");
      console.log("  cor_fundo: #FF0000 (vermelho)");
      console.log("  cor_texto: #FFFFFF (branco)");
      console.log("  texto_botao: Finalizar Compra");
      
      setConfig(testConfig);
      
      try {
        const savedConfig = await handleSaveConfig();
        if (savedConfig) {
          console.log("✅ Configuração de teste salva com sucesso!", savedConfig);
          setSaveSuccess(true);
          toast.success("Teste automático concluído com sucesso!");
          await reloadConfig();
          
          setTimeout(() => {
            setSaveSuccess(false);
          }, 3000);
          return;
        } else {
          console.error("❌ Não foi possível salvar a configuração de teste diretamente");
        }
      } catch (directError) {
        console.error("❌ Erro ao salvar configuração de teste diretamente:", directError);
      }
      
      const testResult = await runAutoSaveTest(
        handleSaveConfig,
        setConfig,
        config
      );
      
      if (testResult) {
        console.log("✅ Teste automático finalizado com sucesso!");
        setSaveSuccess(true);
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("❌ Teste automático falhou");
      }
    } catch (error) {
      console.error("❌ Erro durante execução do teste automático:", error);
      toast.error("Erro durante teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsAutoTestRunning(false);
    }
  };

  return {
    isSaveAttempted,
    saveSuccess,
    isTestSaving,
    isAutoTestRunning,
    onSaveClick,
    runTestSave,
    runAutomaticTest
  };
}
