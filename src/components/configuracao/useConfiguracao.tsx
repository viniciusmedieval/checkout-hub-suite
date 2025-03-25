
import { useState, useEffect } from "react";
import { ConfigCheckout, Depoimento } from "@/lib/types/database-types";
import { fetchCheckoutConfig, fetchTestimonials } from "./services";
import { useConfigSettings } from "./hooks/useConfigSettings";
import { useTestimonials } from "./hooks/useTestimonials";
import { defaultConfig } from "./utils/defaultConfig";
import { toast } from "sonner";
import { PaymentStatus } from "@/components/checkout/payment/types";

export function useConfiguracao() {
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState<ConfigCheckout | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Inicialize com configurações default, será atualizado no useEffect
  const {
    config,
    setConfig,
    isSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    handleSaveConfig,
    hasUnsavedChanges
  } = useConfigSettings(configData);
  
  // Inicialize com array vazio, será atualizado no useEffect
  const {
    depoimentos,
    setDepoimentos,
    isLoading: depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useTestimonials([]);

  // Função para recarregar as configurações do banco de dados
  const reloadConfig = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const fetchedConfig = await fetchCheckoutConfig();
      console.log('✅ Configuração carregada no reloadConfig:', fetchedConfig);
      
      if (fetchedConfig) {
        setConfigData(fetchedConfig);
        setConfig(fetchedConfig);
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
        };
        setConfigData(defaultConfigWithDefaults);
        setConfig(defaultConfigWithDefaults);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      setLoadError("Erro ao carregar configurações");
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        // Fetch config
        const fetchedConfig = await fetchCheckoutConfig();
        console.log('✅ Configuração inicial carregada:', fetchedConfig);
        
        if (fetchedConfig) {
          // Ensure required fields exist
          const configWithDefaults = {
            ...fetchedConfig,
            redirect_card_status: fetchedConfig.redirect_card_status || "analyzing",
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
          };
          
          setConfigData(configWithDefaults);
          setConfig(configWithDefaults);
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
          };
          setConfigData(defaultConfigWithDefaults);
          setConfig(defaultConfigWithDefaults);
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

  // Função para salvar as configurações e forçar recarregamento
  const saveAndReloadConfig = async () => {
    try {
      console.log("🔄 Iniciando saveAndReloadConfig com:", config);
      
      if (!config) {
        console.error("❌ Configuração vazia ou nula");
        toast.error("Erro: Configuração vazia ou nula");
        return false;
      }
      
      // Ensure required fields
      const configToSave = {
        ...config,
        redirect_card_status: config.redirect_card_status || "analyzing",
        // Ensure PIX fields
        pix_titulo: config.pix_titulo || "Pagamento via Pix",
        pix_subtitulo: config.pix_subtitulo || "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.",
        pix_instrucoes: config.pix_instrucoes || "Para realizar o pagamento:",
        pix_mensagem_seguranca: config.pix_mensagem_seguranca || "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.",
        // Ensure Installments field
        max_installments: config.max_installments || 12
      };
      
      // Salvar a configuração
      const savedConfig = await handleSaveConfig();
      
      if (savedConfig) {
        console.log("✅ Configurações salvas com sucesso:", savedConfig);
        toast.success("Configurações aplicadas com sucesso!");
        
        // Atualizar o estado local com os dados salvos
        setConfigData(savedConfig);
        setConfig(savedConfig);
        
        // Força recarregar do banco de dados para garantir consistência
        setTimeout(() => {
          reloadConfig();
        }, 500);
        
        return true;
      } else {
        console.error("❌ Falha ao salvar configurações: retorno nulo");
        toast.error("Configurações não foram salvas. Verifique os erros.");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao salvar e recarregar:", error);
      toast.error("Erro ao salvar as configurações");
      return false;
    }
  };

  return {
    config,
    loading,
    loadError,
    isSaving,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    handleSaveConfig: saveAndReloadConfig,
    hasUnsavedChanges,
    reloadConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  };
}
