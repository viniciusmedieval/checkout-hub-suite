
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
    
    const originalConfig = { ...config };
    
    try {
      // Atualizar a configuração com valores de teste
      setConfig(prev => {
        const testConfig = {
          ...prev,
          cor_fundo: "#FF0000",
          cor_texto: "#FFFFFF",
          texto_botao: "Finalizar Compra"
        };
        return testConfig;
      });

      // Adicionando um pequeno atraso para garantir que o estado seja atualizado
      setTimeout(async () => {
        try {
          const savedConfig = await handleSaveConfig();
          
          if (savedConfig) {
            toast.success("Teste: Configuração salva com sucesso!");
          } else {
            console.error("❌ Teste falhou ao salvar configuração: resultado nulo");
            toast.error("Teste: Erro ao salvar configuração - resultado nulo");
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste falhou com erro", error);
          toast.error("Teste falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
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
  }, [config, setConfig, handleSaveConfig, isTestSaving]);

  return {
    isTestSaving,
    isAutoTestRunning,
    runTestSave,
    setIsAutoTestRunning
  };
};
