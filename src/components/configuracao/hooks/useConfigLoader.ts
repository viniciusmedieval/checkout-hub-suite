
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/types/database-types";
import { getCheckoutConfig } from "../services/fetchConfigService";
import { getTestimonials } from "../services/testimonialService";
import { toast } from "sonner";
import { defaultConfig } from "../utils/defaultConfig";

export const useConfigLoader = () => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [configData, setConfigData] = useState<ConfigCheckout | null>(null);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);

  const loadConfig = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      console.log("📥 Carregando configuração do checkout...");
      
      // Carregar configuração global do checkout
      const config = await getCheckoutConfig();
      
      if (config) {
        // Garantir valores padrão para campos críticos
        const safeConfig: ConfigCheckout = {
          ...config,
          max_installments: config.max_installments || 12,
          redirect_card_status: (config.redirect_card_status as "analyzing" | "approved" | "rejected") || "analyzing"
        };

        console.log("✅ Configuração carregada com sucesso:", safeConfig);
        setConfigData(safeConfig);
      } else {
        console.log("⚠️ Nenhuma configuração encontrada, usando padrão");
        setConfigData(defaultConfig);
      }
      
      // Carregar depoimentos
      const testemunhosList = await getTestimonials();
      console.log("✅ Depoimentos carregados:", testemunhosList);
      setDepoimentos(testemunhosList || []);
      
    } catch (error: any) {
      console.error("❌ Erro ao carregar dados:", error);
      setLoadError(error?.message || "Erro ao carregar dados");
      toast.error("Erro ao carregar configurações");
      setConfigData(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na primeira renderização
  useEffect(() => {
    loadConfig();
  }, []);

  // Função para recarregar as configurações
  const reloadConfig = async () => {
    try {
      setLoading(true);
      console.log("🔄 Recarregando configuração do checkout...");
      
      // Carregar configuração global do checkout
      const config = await getCheckoutConfig();
      
      if (config) {
        // Garantir valores padrão para campos críticos
        const safeConfig: ConfigCheckout = {
          ...config,
          max_installments: config.max_installments || 12,
          redirect_card_status: (config.redirect_card_status as "analyzing" | "approved" | "rejected") || "analyzing"
        };

        console.log("✅ Configuração recarregada com sucesso:", safeConfig);
        setConfigData(safeConfig);
        return safeConfig;
      } else {
        console.log("⚠️ Nenhuma configuração encontrada ao recarregar, usando padrão");
        setConfigData(defaultConfig);
        return defaultConfig;
      }
    } catch (error: any) {
      console.error("❌ Erro ao recarregar dados:", error);
      toast.error("Erro ao recarregar configurações");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadError,
    configData,
    depoimentos,
    setDepoimentos,
    reloadConfig
  };
};
