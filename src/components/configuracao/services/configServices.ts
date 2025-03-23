import { supabase, ConfigCheckout, Depoimento } from "@/lib/supabase";
import { toast } from "sonner";
import { getDefaultTestimonials } from "@/components/checkout/testimonials/DefaultTestimonials";

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

export const fetchTestimonials = async (): Promise<Depoimento[]> => {
  try {
    const { data, error } = await supabase
      .from("depoimentos")
      .select("*")
      .order('criado_em', { ascending: false });
      
    if (error) {
      console.error("Erro ao carregar depoimentos:", error);
      toast.error("Erro ao carregar depoimentos");
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhum depoimento encontrado, adicionando depoimentos padrão");
      const defaultTestimonials = getDefaultTestimonials();
      
      const depoimentosParaInserir = defaultTestimonials.map(dep => ({
        nome: dep.nome,
        texto: dep.texto,
        estrelas: dep.estrelas,
        foto_url: dep.foto_url,
        produto_id: 0,
        criado_em: new Date().toISOString()
      }));
      
      const { data: insertedData, error: insertError } = await supabase
        .from("depoimentos")
        .insert(depoimentosParaInserir)
        .select();
        
      if (insertError) {
        console.error("Erro ao inserir depoimentos padrão:", insertError);
        return [];
      }
      
      console.log("Depoimentos padrão adicionados com sucesso:", insertedData);
      return insertedData || [];
    }
    
    console.log("Depoimentos carregados do banco:", data);
    return data || [];
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);
    toast.error("Erro ao carregar depoimentos. Tente novamente mais tarde.");
    return [];
  }
};

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

export const deleteTestimonial = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("depoimentos")
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success("Depoimento excluído com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    toast.error("Erro ao excluir depoimento. Tente novamente.");
    return false;
  }
};

export const addTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">): Promise<Depoimento | null> => {
  try {
    const { data, error } = await supabase
      .from("depoimentos")
      .insert([depoimento])
      .select();
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      toast.success("Depoimento adicionado com sucesso!");
      return data[0] as Depoimento;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao adicionar depoimento:", error);
    toast.error("Erro ao adicionar depoimento. Tente novamente.");
    return null;
  }
};

export const updateTestimonial = async (id: number, depoimento: Partial<Depoimento>): Promise<Depoimento | null> => {
  try {
    const { data, error } = await supabase
      .from("depoimentos")
      .update(depoimento)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      toast.success("Depoimento atualizado com sucesso!");
      return data[0] as Depoimento;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao atualizar depoimento:", error);
    toast.error("Erro ao atualizar depoimento. Tente novamente.");
    return null;
  }
};
