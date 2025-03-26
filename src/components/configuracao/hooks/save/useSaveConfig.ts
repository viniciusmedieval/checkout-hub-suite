
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

  return {
    isSaveAttempted,
    saveSuccess,
    onSaveClick
  };
};
