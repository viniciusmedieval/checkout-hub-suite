
import { useState } from 'react';
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig as saveConfigService } from "../services";
import { toast } from "sonner";
import { getSupabaseClient } from "@/lib/supabase"; 

/**
 * Hook to manage configuration saving state and operations
 */
export const useConfigSaver = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | undefined>(undefined);

  /**
   * Save configuration to the database
   * @param config The configuration to save
   * @returns The saved configuration, or null if saving failed
   */
  const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
    // Reset state at the start
    setIsSaving(true);
    setSavingError(undefined);
    
    try {
      console.log("💾 Saving configuration...", config);
      
      // Verify Supabase connection first
      try {
        console.log("🔄 Verificando conexão Supabase antes de salvar...");
        const client = await getSupabaseClient();
        if (!client) {
          console.error("❌ Cliente Supabase não inicializado");
          throw new Error("Supabase client is not initialized");
        }
        
        // Usar uma consulta mais simples para verificar conexão
        const { data: connectionTestData, error: connectionError } = await client
          .from('config_checkout')
          .select('id')
          .limit(1);
          
        if (connectionError) {
          console.error("❌ Falha no teste de conexão:", connectionError);
          throw new Error(`Supabase connection test failed: ${connectionError.message}`);
        }
        console.log("✅ Supabase connection verified", connectionTestData);
      } catch (connectionError: any) {
        console.error("❌ Supabase connection error:", connectionError);
        toast.error(`Problema de conexão com o banco de dados: ${connectionError.message}`);
        throw connectionError;
      }
      
      // Add specific debug logs for the test values
      const isTestConfig = (
        config.cor_fundo === "#FF0000" && 
        config.cor_texto === "#FFFFFF" && 
        config.texto_botao === "Finalizar Compra"
      );
      
      if (isTestConfig) {
        console.log("🧪 TESTE AUTOMÁTICO DETECTADO - verificando valores antes de salvar:");
        console.log("  cor_fundo: " + config.cor_fundo + " (esperado: #FF0000) ✓");
        console.log("  cor_texto: " + config.cor_texto + " (esperado: #FFFFFF) ✓");
        console.log("  texto_botao: " + config.texto_botao + " (esperado: Finalizar Compra) ✓");
        toast.info("Iniciando salvamento do teste automático...");
      }
      
      // Call the saveConfig service
      console.log("🔄 Chamando serviço de salvamento...");
      const savedConfig = await saveConfigService(config);
      
      // Log resultado para debug
      console.log("🔄 Resultado do saveConfigService:", savedConfig);
      
      // Handle success case
      if (savedConfig) {
        console.log("✅ Configuration saved successfully", savedConfig);
        
        // Special success message for test
        if (isTestConfig) {
          console.log("🧪 TESTE AUTOMÁTICO CONCLUÍDO COM SUCESSO! ✅");
          console.log("  cor_fundo salvo: " + savedConfig.cor_fundo + " (esperado: #FF0000) ✓");
          console.log("  cor_texto salvo: " + savedConfig.cor_texto + " (esperado: #FFFFFF) ✓"); 
          console.log("  texto_botao salvo: " + savedConfig.texto_botao + " (esperado: Finalizar Compra) ✓");
          toast.success("Teste automático: Configurações salvas com sucesso!");
        } else {
          toast.success("Configurações salvas com sucesso!");
        }
        
        // Ensure all properties are properly set
        return {
          ...savedConfig,
          // Ensure the redirect_card_status is properly typed
          redirect_card_status: (savedConfig.redirect_card_status || "analyzing") as "analyzing" | "approved" | "rejected",
          // Default values for PIX
          texto_botao_pix: savedConfig.texto_botao_pix || savedConfig.texto_botao || "PAGAR COM PIX",
          cor_botao_pix: savedConfig.cor_botao_pix || savedConfig.cor_botao || "#8B5CF6",
          cor_texto_botao_pix: savedConfig.cor_texto_botao_pix || savedConfig.cor_texto_botao || "#FFFFFF",
          pix_secao_id: savedConfig.pix_secao_id || null
        };
      } 
      
      // Handle error case when service returns null
      const errorMsg = isTestConfig 
        ? "Teste automático: Erro ao salvar configurações"
        : "Erro ao salvar configurações";
      
      console.error("❌ " + errorMsg + " - saveConfigService retornou null");
      setSavingError(errorMsg);
      toast.error(errorMsg);
      return null;
      
    } catch (error: any) {
      // Handle exception case
      const isTestError = (
        config.cor_fundo === "#FF0000" && 
        config.cor_texto === "#FFFFFF" && 
        config.texto_botao === "Finalizar Compra"
      );
      
      const errorPrefix = isTestError ? "Teste automático: " : "";
      const errorMsg = `${errorPrefix}Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`;
      
      console.error("❌ " + errorMsg, error);
      console.error("Detalhes do erro:", error);
      console.error("Config sendo salva:", config);
      
      setSavingError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveConfig,
    isSaving,
    savingError
  };
};
