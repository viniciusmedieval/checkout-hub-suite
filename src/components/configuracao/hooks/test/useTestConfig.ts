
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
    console.log("🔄 runTestSave iniciado");
    
    if (isTestSaving) {
      console.log("ℹ️ Teste de salvamento já em andamento");
      return;
    }
    
    setIsTestSaving(true);
    toast.loading("Executando teste de salvamento...");
    
    const originalConfig = { ...config };
    
    try {
      console.log("🔄 Iniciando teste automático de salvamento de configuração");
      console.log("🔄 Valores de teste sendo definidos:");
      console.log("  - cor_fundo: #FF0000");
      console.log("  - cor_texto: #FFFFFF");
      console.log("  - texto_botao: Finalizar Compra");
      
      // Atualizar a configuração com valores de teste
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

      // Adicionando um pequeno atraso para garantir que o estado seja atualizado
      setTimeout(async () => {
        try {
          console.log("🔄 Chamando handleSaveConfig para salvar teste...");
          const savedConfig = await handleSaveConfig();
          console.log("DEBUG valor de savedConfig:", savedConfig);
          
          if (savedConfig) {
            console.log("✅ Teste automático - Configuração salva com sucesso:", savedConfig);
            console.log("Verificando valores salvos:");
            console.log(`- cor_fundo: ${savedConfig.cor_fundo} (esperado: #FF0000) ${savedConfig.cor_fundo === "#FF0000" ? "✓" : "✗"}`);
            console.log(`- cor_texto: ${savedConfig.cor_texto} (esperado: #FFFFFF) ${savedConfig.cor_texto === "#FFFFFF" ? "✓" : "✗"}`);
            console.log(`- texto_botao: ${savedConfig.texto_botao} (esperado: Finalizar Compra) ${savedConfig.texto_botao === "Finalizar Compra" ? "✓" : "✗"}`);
            toast.success("Teste: Configuração salva com sucesso!");
          } else {
            console.error("❌ Teste falhou ao salvar configuração: resultado nulo");
            console.error("Verificar logs do serviço de salvamento para mais detalhes");
            console.error("handleSaveConfig retornou:", savedConfig);
            toast.error("Teste: Erro ao salvar configuração - resultado nulo");
            setConfig(originalConfig);
          }
        } catch (error) {
          console.error("❌ Teste falhou com erro", error);
          console.error("Stack trace:", error instanceof Error ? error.stack : "Sem stack trace");
          toast.error("Teste falhou: " + (error instanceof Error ? error.message : "Erro desconhecido"));
          setConfig(originalConfig);
        } finally {
          setIsTestSaving(false);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Erro ao executar teste", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : "Sem stack trace");
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
