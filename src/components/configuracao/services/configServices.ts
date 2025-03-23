
import { supabase, ConfigCheckout, Depoimento } from "@/lib/supabase";
import { toast } from "sonner";

// Função para buscar as configurações do checkout
export const fetchCheckoutConfig = async () => {
  try {
    const { data: checkoutConfig, error: configError } = await supabase
      .from("config_checkout")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (configError) {
      console.error("Erro ao carregar configurações do checkout:", configError);
      toast.error("Erro ao carregar configurações do checkout");
      return null;
    } 
    
    if (checkoutConfig && checkoutConfig.length > 0) {
      console.log("Configurações carregadas:", checkoutConfig[0]);
      return checkoutConfig[0];
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    toast.error("Erro ao carregar configurações do checkout");
    return null;
  }
};

// Função para buscar os depoimentos
export const fetchTestimonials = async () => {
  try {
    const { data: testimonials, error: testimonialsError } = await supabase
      .from("depoimentos")
      .select("*")
      .order('created_at', { ascending: false });
      
    if (testimonialsError) {
      console.error("Erro ao carregar depoimentos:", testimonialsError);
      toast.error("Erro ao carregar depoimentos");
      return [];
    } 
    
    return testimonials || [];
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);
    toast.error("Erro ao carregar depoimentos");
    return [];
  }
};

// Função para salvar as configurações
export const saveConfigSettings = async (config: ConfigCheckout) => {
  try {
    // Validação para garantir que as cores estão em formato válido de hex
    const validateHex = (color: string) => {
      return color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    };
    
    const configToSave = {
      mensagem_topo: config.mensagem_topo,
      cor_topo: validateHex(config.cor_topo) ? config.cor_topo : "#3b82f6",
      ativa_banner: config.ativa_banner,
      banner_url: config.banner_url,
      banner_mobile_url: config.banner_mobile_url,
      cor_banner: validateHex(config.cor_banner) ? config.cor_banner : "#3b82f6",
      cor_fundo: validateHex(config.cor_fundo) ? config.cor_fundo : "#FFFFFF",
      cor_titulo: validateHex(config.cor_titulo) ? config.cor_titulo : "#000000", 
      texto_botao: config.texto_botao,
      rodape_texto: config.rodape_texto,
      rodape_empresa: config.rodape_empresa,
      rodape_ano: config.rodape_ano,
      mostrar_seguro: config.mostrar_seguro,
      mensagem_rodape: config.mensagem_rodape
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
    
    // Recarregar a configuração para garantir que temos os dados mais recentes
    return await fetchCheckoutConfig();
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    throw error;
  }
};

// Função para excluir um depoimento
export const deleteTestimonial = async (id: number) => {
  try {
    const { error } = await supabase
      .from("depoimentos")
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    throw error;
  }
};

// Função para adicionar um depoimento
export const addTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">) => {
  try {
    const { data, error } = await supabase
      .from("depoimentos")
      .insert([depoimento])
      .select();
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data[0] as Depoimento;
    }
    
    throw new Error("Nenhum dado retornado após inserção");
  } catch (error) {
    console.error("Erro ao adicionar depoimento:", error);
    throw error;
  }
};
