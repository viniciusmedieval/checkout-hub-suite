
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/types/database-types";
import { fetchCheckoutConfig, fetchTestimonials } from "../services";
import { defaultConfig } from "../utils/defaultConfig";
import { toast } from "sonner";
import { PaymentStatus } from "@/components/checkout/payment/types";

export const useConfigLoader = () => {
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState<ConfigCheckout | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);

  // Function to reload the configuration from the database
  const reloadConfig = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const fetchedConfig = await fetchCheckoutConfig();
      console.log('✅ Configuração carregada no reloadConfig:', fetchedConfig);
      
      if (fetchedConfig) {
        // Ensure redirect_card_status is the correct type
        const typedConfig = {
          ...fetchedConfig,
          redirect_card_status: (fetchedConfig.redirect_card_status || "analyzing") as PaymentStatus,
          max_installments: fetchedConfig.max_installments || 12
        } as ConfigCheckout;
        
        setConfigData(typedConfig);
      } else {
        console.log('ℹ️ Usando configuração padrão no reloadConfig');
        const defaultConfigWithDefaults = {
          ...defaultConfig,
          redirect_card_status: "analyzing" as PaymentStatus,
          // PIX defaults
          pix_titulo: "Pagamento via Pix",
          pix_subtitulo: "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.",
          pix_instrucoes: "Para realizar o pagamento:",
          pix_mensagem_seguranca: "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.",
          cor_primaria_pix: "#1E40AF",
          cor_secundaria_pix: "#DBEAFE",
          tipo_chave_pix_global: "email",
          usar_api_pix_global: false,
          // Installments default
          max_installments: 12
        } as ConfigCheckout;
        
        setConfigData(defaultConfigWithDefaults);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      setLoadError("Erro ao carregar configurações");
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        // Fetch config
        const fetchedConfig = await fetchCheckoutConfig();
        console.log('✅ Configuração inicial carregada:', fetchedConfig);
        
        if (fetchedConfig) {
          // Ensure required fields exist with proper typing
          const configWithDefaults = {
            ...fetchedConfig,
            redirect_card_status: (fetchedConfig.redirect_card_status || "analyzing") as PaymentStatus,
            // PIX defaults if not set
            pix_titulo: fetchedConfig.pix_titulo || "Pagamento via Pix",
            pix_subtitulo: fetchedConfig.pix_subtitulo || "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.",
            pix_instrucoes: fetchedConfig.pix_instrucoes || "Para realizar o pagamento:",
            pix_mensagem_seguranca: fetchedConfig.pix_mensagem_seguranca || "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.",
            cor_primaria_pix: fetchedConfig.cor_primaria_pix || "#1E40AF",
            cor_secundaria_pix: fetchedConfig.cor_secundaria_pix || "#DBEAFE",
            tipo_chave_pix_global: fetchedConfig.tipo_chave_pix_global || "email",
            usar_api_pix_global: fetchedConfig.usar_api_pix_global || false,
            // Installments default
            max_installments: fetchedConfig.max_installments || 12
          } as ConfigCheckout;
          
          setConfigData(configWithDefaults);
        } else {
          console.log('ℹ️ Usando configuração padrão no useEffect inicial');
          const defaultConfigWithDefaults = {
            ...defaultConfig,
            redirect_card_status: "analyzing" as PaymentStatus,
            // PIX defaults
            pix_titulo: "Pagamento via Pix",
            pix_subtitulo: "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.",
            pix_instrucoes: "Para realizar o pagamento:",
            pix_mensagem_seguranca: "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.",
            cor_primaria_pix: "#1E40AF",
            cor_secundaria_pix: "#DBEAFE",
            tipo_chave_pix_global: "email",
            usar_api_pix_global: false,
            // Installments default
            max_installments: 12
          } as ConfigCheckout;
          
          setConfigData(defaultConfigWithDefaults);
        }
        
        // Fetch testimonials
        const testimonialsData = await fetchTestimonials();
        if (testimonialsData) {
          setDepoimentos(testimonialsData);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
        setLoadError("Erro ao carregar configurações");
        toast.error('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    loadError,
    configData,
    depoimentos,
    setDepoimentos,
    reloadConfig
  };
};
