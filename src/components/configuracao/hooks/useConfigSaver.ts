
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
      // Verify Supabase connection first
      try {
        const client = await getSupabaseClient();
        if (!client) {
          console.error("❌ Cliente Supabase não inicializado");
          throw new Error("Supabase client is not initialized");
        }
        
        // Usar uma consulta mais simples para verificar conexão
        const { error: connectionError } = await client
          .from('config_checkout')
          .select('id')
          .limit(1);
          
        if (connectionError) {
          console.error("❌ Falha no teste de conexão:", connectionError);
          throw new Error(`Supabase connection test failed: ${connectionError.message}`);
        }
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
        toast.info("Iniciando salvamento do teste automático...");
      }
      
      // Call the saveConfig service
      const savedConfig = await saveConfigService(config);
      
      // Handle success case
      if (savedConfig) {
        if (isTestConfig) {
          toast.success("Teste automático: Configurações salvas com sucesso!");
        } else {
          toast.success("Configurações salvas com sucesso!");
        }
        
        return savedConfig;
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
