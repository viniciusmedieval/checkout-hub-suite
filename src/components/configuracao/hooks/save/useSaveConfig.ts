
import { useState } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";

export const useSaveConfig = (
  config: ConfigCheckout,
  handleSaveConfig: () => Promise<ConfigCheckout | null>,
  hasUnsavedChanges: () => boolean
) => {
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const onSaveClick = async () => {
    console.log("🔄 onSaveClick iniciado");
    
    if (!hasUnsavedChanges()) {
      console.log("ℹ️ Sem alterações para salvar");
      toast.info("Não há alterações para salvar");
      return;
    }

    try {
      setIsSaveAttempted(true);
      toast.loading("Salvando configurações...");
      console.log("🔄 Tentando salvar configuração...");
      console.log("🔄 Config atual:", config);
      
      const result = await handleSaveConfig();
      console.log("DEBUG valor de result:", result);
      
      if (result) {
        console.log("✅ Configuração salva com sucesso:", result);
        setSaveSuccess(true);
        toast.success("Configurações salvas com sucesso!");
      } else {
        console.error("❌ Erro ao salvar configurações: resultado nulo");
        console.error("Verificar logs do serviço de salvamento para mais detalhes");
        toast.error("Erro ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("❌ Exceção ao salvar configurações:", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : "Sem stack trace");
      toast.error("Erro ao salvar: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      console.log("🔄 Finalizando tentativa de salvamento");
      setTimeout(() => {
        setIsSaveAttempted(false);
        if (saveSuccess) {
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }, 1000);
    }
  };

  return {
    isSaveAttempted,
    saveSuccess,
    onSaveClick
  };
};
