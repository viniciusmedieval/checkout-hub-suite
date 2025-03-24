
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Fetches the most recent checkout configuration
 */
export const fetchCheckoutConfig = async (): Promise<ConfigCheckout | null> => {
  try {
    const { data, error } = await supabase
      .from("config_checkout")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Erro ao carregar configurações do checkout:", error);
      toast.error("Erro ao carregar configurações do checkout");
      return null;
    }
    
    if (data && data.length > 0) {
      console.log("Configurações carregadas:", data[0]);
      return data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    toast.error("Erro ao carregar configurações. Tente novamente mais tarde.");
    return null;
  }
};

/**
 * Saves checkout configuration to the database
 */
export const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
  try {
    const validateHex = (color: string) => {
      return color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    };
    
    const configToSave = {
      mensagem_topo: config.mensagem_topo,
      cor_topo: validateHex(config.cor_topo) ? config.cor_topo : "#3b82f6",
      cor_texto_topo: validateHex(config.cor_texto_topo) ? config.cor_texto_topo : "#FFFFFF",
      ativa_banner: config.ativa_banner,
      banner_url: config.banner_url,
      banner_mobile_url: config.banner_mobile_url,
      cor_banner: validateHex(config.cor_banner) ? config.cor_banner : "#3b82f6",
      cor_fundo: validateHex(config.cor_fundo) ? config.cor_fundo : "#FFFFFF",
      cor_titulo: validateHex(config.cor_titulo) ? config.cor_titulo : "#000000",
      texto_botao: config.texto_botao,
      cor_botao: validateHex(config.cor_botao) ? config.cor_botao : "#8B5CF6",
      cor_texto_botao: validateHex(config.cor_texto_botao) ? config.cor_texto_botao : "#FFFFFF",
      rodape_texto: config.rodape_texto,
      rodape_empresa: config.rodape_empresa,
      rodape_ano: config.rodape_ano,
      mostrar_seguro: config.mostrar_seguro,
      mensagem_rodape: config.mensagem_rodape,
      mensagem_termos: config.mensagem_termos,
      url_termos_uso: config.url_termos_uso,
      url_politica_privacidade: config.url_politica_privacidade,
      // Add the new fields
      mostrar_campo_documento: config.mostrar_campo_documento,
      mostrar_campo_telefone: config.mostrar_campo_telefone,
      titulo_identificacao: config.titulo_identificacao || "Identificação",
      titulo_pagamento: config.titulo_pagamento || "Pagamento"
    };
    
    console.log("Configurações validadas a serem salvas:", configToSave);
    
    let result;
    
    if (config.id) {
      result = await supabase
        .from("config_checkout")
        .update(configToSave)
        .eq('id', config.id);
    } else {
      result = await supabase
        .from("config_checkout")
        .insert([configToSave]);
    }
    
    if (result.error) {
      console.error("Erro ao salvar configurações:", result.error);
      throw result.error;
    }
    
    console.log("Configurações salvas com sucesso:", result);
    toast.success("Configurações salvas com sucesso!");
    
    const { data: refreshedConfig, error: refreshError } = await supabase
      .from("config_checkout")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (refreshError) {
      console.error("Erro ao recarregar config após salvar:", refreshError);
      return null;
    }  
    
    if (refreshedConfig && refreshedConfig.length > 0) {
      console.log("Configurações atualizadas após salvamento:", refreshedConfig[0]);
      return refreshedConfig[0];
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    toast.error("Erro ao salvar configurações. Tente novamente.");
    return null;
  }
};
