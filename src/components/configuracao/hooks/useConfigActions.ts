
import { useState } from 'react';
import { ConfigCheckout } from '@/lib/types/database-types';
import { toast } from 'sonner';

export const useConfigActions = (
  config: ConfigCheckout, 
  setConfig: (newConfig: ConfigCheckout) => void,
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  hasUnsavedChanges: () => boolean,
  reloadConfig: () => Promise<ConfigCheckout | null>
) => {
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestSaving, setIsTestSaving] = useState(false);
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);

  // Function to handle save button click
  const onSaveClick = async () => {
    if (!hasUnsavedChanges()) {
      toast.info("Não há alterações para salvar");
      return;
    }

    try {
      setIsSaveAttempted(true);
      toast.loading("Salvando configurações...");
      
      const result = await handleSaveConfig();
      
      if (result) {
        setSaveSuccess(true);
        toast.success("Configurações salvas com sucesso!");
      } else {
        console.error("Erro ao salvar configurações: resultado nulo");
        toast.error("Erro ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("Exceção ao salvar configurações:", error);
      toast.error("Erro ao salvar: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setTimeout(() => {
        setIsSaveAttempted(false);
        if (saveSuccess) {
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }, 1000);
    }
  };

  // Function to run a test save (with specific test values)
  const runTestSave = async () => {
    try {
      console.log("🔘 Botão de testar salvamento clicado");
      setIsTestSaving(true);
      
      // Save the current configuration
      const currentConfig = { ...config };
      
      // Apply test values
      setConfig({
        ...currentConfig,
        cor_fundo: "#FF0000",
        cor_texto: "#FFFFFF",
        texto_botao: "Finalizar Compra"
      });
      
      // Save the test configuration
      toast.loading("Testando salvamento...");
      const result = await handleSaveConfig();
      
      if (result) {
        toast.success("Teste concluído com sucesso!");
        console.log("✅ Função runTestSave executada com sucesso");
      } else {
        console.error("Teste falhou ao salvar configuração: resultado nulo");
        toast.error("Teste falhou, mas isso pode ser esperado em ambiente de testes");
      }
      
      // Restore the original config
      setConfig(currentConfig);
      
      // Reload the saved configuration from the backend
      await reloadConfig();
    } catch (error) {
      console.error("❌ Erro durante teste de salvamento:", error);
      toast.error("Erro durante teste: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsTestSaving(false);
    }
  };

  // Function to run automatic test
  const runAutomaticTest = async () => {
    try {
      setIsAutoTestRunning(true);
      toast.loading("Iniciando teste automático...");
      
      // Save the current configuration
      const currentConfig = { ...config };
      
      // Step 1: Apply test values
      toast.info("Etapa 1: Aplicando valores de teste", {
        duration: 2000,
      });
      
      setConfig({
        ...currentConfig,
        cor_fundo: "#FF0000",
        cor_texto: "#FFFFFF",
        texto_botao: "Finalizar Compra"
      });
      
      // Step 2: Test the save operation
      toast.info("Etapa 2: Testando salvamento", {
        duration: 2000,
      });
      
      const result = await handleSaveConfig();
      
      if (result) {
        toast.success("Teste de salvamento concluído com sucesso!");
      } else {
        toast.error("Teste de salvamento falhou, verificando causas...");
        console.error("Teste automático falhou na etapa de salvamento");
      }
      
      // Step 3: Restore the original configuration
      toast.info("Etapa 3: Restaurando configuração original", {
        duration: 2000,
      });
      
      setConfig(currentConfig);
      
      // Step 4: Reload saved configuration
      toast.info("Etapa 4: Recarregando configuração salva", {
        duration: 2000,
      });
      
      await reloadConfig();
      
      toast.success("Teste automático concluído!", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Erro durante teste automático:", error);
      toast.error("Erro no teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
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
};
