
import { useState } from 'react';
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig as saveConfigService } from "../services";
import { toast } from "sonner";

export const useConfigSaver = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | undefined>(undefined);

  // Save config function
  const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
    try {
      setIsSaving(true);
      setSavingError(undefined);
      
      console.log("💾 Salvando configuração:", config);
      
      // Log all color properties to validate they're being saved
      console.log("Colors being saved:", {
        corTopo: config.cor_topo,
        corTextoTopo: config.cor_texto_topo,
        corFundo: config.cor_fundo,
        corBanner: config.cor_banner,
        corTitulo: config.cor_titulo,
        corBotao: config.cor_botao,
        corTextoBotao: config.cor_texto_botao,
        corBotaoCard: config.cor_botao_card,
        corTextoBotaoCard: config.cor_texto_botao_card,
        corIcones: config.cor_icones
      });
      
      // Call the saveConfig service
      const savedConfig = await saveConfigService(config);
      
      if (savedConfig) {
        console.log("✅ Configuração salva com sucesso:", savedConfig);
        toast.success("Configurações salvas com sucesso!");
        // Ensure the redirect_card_status is properly typed
        return {
          ...savedConfig,
          redirect_card_status: (savedConfig.redirect_card_status || "analyzing") as "analyzing" | "approved" | "rejected"
        };
      } else {
        const errorMsg = "Erro ao salvar configurações";
        console.error("❌ " + errorMsg);
        setSavingError(errorMsg);
        toast.error(errorMsg);
        return null;
      }
    } catch (error: any) {
      console.error("❌ Erro ao salvar configurações:", error);
      const errorMsg = `Erro ao salvar configurações: ${error.message || "Erro desconhecido"}`;
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
