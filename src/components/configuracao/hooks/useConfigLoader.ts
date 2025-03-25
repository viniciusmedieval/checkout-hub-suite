
import { useState, useEffect } from "react";
import { Depoimento, ConfigCheckout as ConfigCheckoutType } from "@/lib/supabase";
import { toast } from "sonner";
import { fetchCheckoutConfig } from "../services/fetchConfigService";
import { fetchTestimonials } from "../services/testimonialService";

// Define a proper type that includes max_installments
interface ConfigCheckout extends ConfigCheckoutType {
  max_installments?: number;
}

export function useConfigLoader() {
  const [config, setConfig] = useState<ConfigCheckout | null>(null);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch checkout configuration
      const configData = await fetchCheckoutConfig();
      
      if (configData) {
        // Ensure max_installments has a default value if not set
        const processedConfig: ConfigCheckout = {
          ...configData,
          max_installments: configData.max_installments || 12
        };
        
        setConfig(processedConfig);
      } else {
        setConfig(null);
        setError("Não foi possível carregar a configuração");
        toast.error("Erro ao carregar configuração");
      }

      // Fetch testimonials
      const testimonials = await fetchTestimonials();
      setDepoimentos(testimonials || []);
      
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
      setError("Ocorreu um erro ao carregar as configurações");
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  // Reload configuration
  const reloadConfig = async () => {
    await loadConfig();
  };

  // Load configuration on component mount
  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config: config as ConfigCheckout,
    depoimentos,
    loading,
    error,
    reloadConfig,
    setConfig: (newConfig: ConfigCheckout) => {
      // Ensure max_installments is set when updating config
      setConfig({
        ...newConfig,
        max_installments: newConfig.max_installments || 12
      });
    },
    setDepoimentos
  };
}
