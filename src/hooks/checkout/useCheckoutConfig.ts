
import { useState, useEffect } from "react";
import { ConfigCheckout, supabase } from "@/lib/supabase";
import { PaymentStatus } from "@/components/checkout/payment/types";
import { fetchCheckoutConfig } from "@/components/configuracao/services";

export const useCheckoutConfig = () => {
  const [configCheckout, setConfigCheckout] = useState<ConfigCheckout | null>(null);

  const fetchCheckoutConfigData = async () => {
    try {
      console.log("🔄 useCheckoutConfig - Iniciando carregamento da configuração");
      
      // Tentar buscar usando o serviço centralizado primeiro
      const config = await fetchCheckoutConfig();
      
      if (config) {
        console.log("✅ useCheckoutConfig - Configuração carregada do serviço centralizado");
        
        // Garantir que cores estão em formato hex válido
        const validateHex = (color: string | null | undefined) => {
          return color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
        };
        
        if (!validateHex(config.cor_topo)) config.cor_topo = "#3b82f6";
        if (!validateHex(config.cor_fundo)) config.cor_fundo = "#FFFFFF";
        if (!validateHex(config.cor_banner)) config.cor_banner = "#3b82f6";
        if (!validateHex(config.cor_titulo)) config.cor_titulo = "#000000";
        if (!validateHex(config.cor_botao)) config.cor_botao = "#8B5CF6"; 
        if (!validateHex(config.cor_texto_botao)) config.cor_texto_botao = "#FFFFFF";
        if (!validateHex(config.cor_texto_contador)) config.cor_texto_contador = "#4B5563";
        
        // Ensure redirect_card_status is a valid value
        const validStatuses: PaymentStatus[] = ["analyzing", "approved", "rejected"];
        if (!config.redirect_card_status || !validStatuses.includes(config.redirect_card_status as PaymentStatus)) {
          config.redirect_card_status = "analyzing";
        }
        
        // Ensure modo_random is a boolean
        config.modo_random = !!config.modo_random;
        
        setConfigCheckout(config);
        console.log("🔄 Configurações carregadas com sucesso do serviço centralizado", config);
        return config;
      }
      
      console.log("⚠️ useCheckoutConfig - Serviço centralizado não retornou dados, usando fallback");
      
      // Fallback para o método antigo
      const { data: checkoutConfig, error: configError } = await supabase
        .from("config_checkout")
        .select("*")
        .order('criado_em', { ascending: false })
        .limit(1);
        
      if (configError) {
        console.error("❌ useCheckoutConfig - Erro ao carregar configurações do checkout:", configError);
        // Continuamos sem definir erro, apenas logar para não interromper o fluxo
      } else if (checkoutConfig && checkoutConfig.length > 0) {
        console.log("✅ useCheckoutConfig - Configurações carregadas com sucesso do fallback");
        
        // Validar cores antes de aplicar
        if (checkoutConfig[0]) {
          const config = {...checkoutConfig[0]};
          
          // Garantir que cores estão em formato hex válido
          const validateHex = (color: string | null | undefined) => {
            return color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
          };
          
          if (!validateHex(config.cor_topo)) config.cor_topo = "#3b82f6";
          if (!validateHex(config.cor_fundo)) config.cor_fundo = "#FFFFFF";
          if (!validateHex(config.cor_banner)) config.cor_banner = "#3b82f6";
          if (!validateHex(config.cor_titulo)) config.cor_titulo = "#000000";
          if (!validateHex(config.cor_botao)) config.cor_botao = "#8B5CF6"; 
          if (!validateHex(config.cor_texto_botao)) config.cor_texto_botao = "#FFFFFF";
          if (!validateHex(config.cor_texto_contador)) config.cor_texto_contador = "#4B5563";
          
          // Ensure redirect_card_status is a valid value
          const validStatuses: PaymentStatus[] = ["analyzing", "approved", "rejected"];
          if (!config.redirect_card_status || !validStatuses.includes(config.redirect_card_status as PaymentStatus)) {
            config.redirect_card_status = "analyzing";
          }
          
          // Ensure modo_random is a boolean
          config.modo_random = !!config.modo_random;
          
          setConfigCheckout(config);
          console.log("🔄 Configurações carregadas com sucesso do fallback", config);
          return config;
        }
      }
      
      console.log("⚠️ useCheckoutConfig - Nenhuma configuração encontrada, usando padrão");
      
      // Definir configuração padrão como fallback
      const defaultConfig: ConfigCheckout = {
        id: 0,
        cor_topo: "#3b82f6",
        cor_fundo: "#FFFFFF",
        cor_banner: "#3b82f6",
        cor_titulo: "#000000",
        cor_botao: "#8B5CF6",
        cor_texto_botao: "#FFFFFF",
        cor_texto_contador: "#4B5563",
        cor_texto_topo: "#FFFFFF",
        mensagem_topo: "Oferta por tempo limitado!",
        texto_botao: "Finalizar Compra",
        rodape_texto: "Todos os direitos reservados",
        rodape_empresa: "Sua Empresa",
        rodape_ano: new Date().getFullYear().toString(),
        mostrar_seguro: true,
        ativa_banner: true,
        banner_url: "",
        banner_mobile_url: "",
        mensagem_rodape: "Compra 100% segura e garantida.",
        redirect_card_status: "analyzing",
        modo_random: false
      };
      
      setConfigCheckout(defaultConfig);
      console.log("⚠️ Usando configuração padrão pois não foi possível carregar do banco", defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error("❌ Erro ao buscar configuração do checkout:", error);
      
      // Definir configuração padrão em caso de erro
      const defaultConfig: ConfigCheckout = {
        id: 0,
        cor_topo: "#3b82f6",
        cor_fundo: "#FFFFFF",
        cor_banner: "#3b82f6",
        cor_titulo: "#000000",
        cor_botao: "#8B5CF6",
        cor_texto_botao: "#FFFFFF",
        cor_texto_contador: "#4B5563",
        cor_texto_topo: "#FFFFFF",
        mensagem_topo: "Oferta por tempo limitado!",
        texto_botao: "Finalizar Compra",
        rodape_texto: "Todos os direitos reservados",
        rodape_empresa: "Sua Empresa",
        rodape_ano: new Date().getFullYear().toString(),
        mostrar_seguro: true,
        ativa_banner: true,
        banner_url: "",
        banner_mobile_url: "",
        mensagem_rodape: "Compra 100% segura e garantida.",
        redirect_card_status: "analyzing",
        modo_random: false
      };
      
      setConfigCheckout(defaultConfig);
      console.error("❌ Erro ao buscar configuração, usando padrão", error);
      return defaultConfig;
    }
  };

  return {
    configCheckout,
    fetchCheckoutConfig: fetchCheckoutConfigData
  };
};
