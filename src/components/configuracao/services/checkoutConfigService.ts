
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
      // Ensure boolean fields are properly typed
      const configData = {
        ...data[0],
        mostrar_seguro: Boolean(data[0].mostrar_seguro),
        ativa_banner: Boolean(data[0].ativa_banner),
        mostrar_campo_documento: Boolean(data[0].mostrar_campo_documento),
        mostrar_campo_telefone: Boolean(data[0].mostrar_campo_telefone),
        mostrar_contador: Boolean(data[0].mostrar_contador)
      };
      
      console.log("Configurações carregadas:", configData);
      return configData;
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
    
    // Log the mostrar_seguro value to check its type and value
    console.log("Valor mostrar_seguro antes de salvar:", config.mostrar_seguro, typeof config.mostrar_seguro);
    
    const configToSave = {
      mensagem_topo: config.mensagem_topo,
      cor_topo: validateHex(config.cor_topo) ? config.cor_topo : "#3b82f6",
      cor_texto_topo: validateHex(config.cor_texto_topo) ? config.cor_texto_topo : "#FFFFFF",
      ativa_banner: Boolean(config.ativa_banner),
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
      // Explicitly set to a boolean value to ensure it's saved correctly
      mostrar_seguro: Boolean(config.mostrar_seguro),
      mensagem_rodape: config.mensagem_rodape,
      mensagem_termos: config.mensagem_termos,
      url_termos_uso: config.url_termos_uso,
      url_politica_privacidade: config.url_politica_privacidade,
      // Form fields
      mostrar_campo_documento: Boolean(config.mostrar_campo_documento),
      mostrar_campo_telefone: Boolean(config.mostrar_campo_telefone),
      titulo_identificacao: config.titulo_identificacao || "Identificação",
      titulo_pagamento: config.titulo_pagamento || "Pagamento",
      // Visitor counter fields
      mostrar_contador: Boolean(config.mostrar_contador),
      texto_contador: config.texto_contador || "{count} pessoas estão vendo este produto agora",
      contador_min: config.contador_min || 50,
      contador_max: config.contador_max || 20000,
      // Icon properties
      cor_icones: validateHex(config.cor_icones) ? config.cor_icones : "#8a898c",
      icone_nome: config.icone_nome || "user",
      icone_email: config.icone_email || "mail",
      icone_telefone: config.icone_telefone || "smartphone",
      icone_documento: config.icone_documento || "file-text"
    };
    
    console.log("Configurações validadas a serem salvas:", configToSave);
    console.log("Valor final de mostrar_seguro:", configToSave.mostrar_seguro, typeof configToSave.mostrar_seguro);
    
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
      // Ensure boolean fields are properly typed in the refreshed config
      const updatedConfig = {
        ...refreshedConfig[0],
        mostrar_seguro: Boolean(refreshedConfig[0].mostrar_seguro),
        ativa_banner: Boolean(refreshedConfig[0].ativa_banner),
        mostrar_campo_documento: Boolean(refreshedConfig[0].mostrar_campo_documento),
        mostrar_campo_telefone: Boolean(refreshedConfig[0].mostrar_campo_telefone),
        mostrar_contador: Boolean(refreshedConfig[0].mostrar_contador)
      };
      
      console.log("Configurações atualizadas após salvamento:", updatedConfig);
      return updatedConfig;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    toast.error("Erro ao salvar configurações. Tente novamente.");
    return null;
  }
};
