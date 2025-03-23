
import { useState, useEffect } from "react";
import { supabase, ConfigCheckout, Depoimento } from "@/lib/supabase";
import { toast } from "sonner";

export function useConfiguracao() {
  const [config, setConfig] = useState<ConfigCheckout>({
    id: 0,
    mensagem_topo: "Oferta especial por tempo limitado! Aproveite agora.",
    cor_topo: "#3b82f6",
    ativa_banner: true,
    banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Desktop",
    banner_mobile_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Banner+Mobile",
    cor_banner: "#3b82f6",
    cor_fundo: "#FFFFFF",
    cor_titulo: "#000000", // Default title color
    texto_botao: "GARANTIR AGORA",
    rodape_texto: "Todos os direitos reservados.",
    rodape_empresa: "Minha Empresa LTDA",
    rodape_ano: "2023",
    mostrar_seguro: true,
    mensagem_rodape: "Compra 100% segura e garantida."
  });

  const [loading, setLoading] = useState(true);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [depoimentosSaving, setDepoimentosSaving] = useState(false);

  useEffect(() => {
    const fetchConfigData = async () => {
      setLoading(true);
      try {
        const { data: checkoutConfig, error: configError } = await supabase
          .from("config_checkout")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (configError) {
          console.error("Erro ao carregar configurações do checkout:", configError);
          toast.error("Erro ao carregar configurações do checkout");
        } else if (checkoutConfig && checkoutConfig.length > 0) {
          console.log("Configurações carregadas:", checkoutConfig[0]);
          setConfig(checkoutConfig[0]);
        }
        
        const { data: testimonials, error: testimonialsError } = await supabase
          .from("depoimentos")
          .select("*")
          .order('created_at', { ascending: false });
          
        if (testimonialsError) {
          console.error("Erro ao carregar depoimentos:", testimonialsError);
          toast.error("Erro ao carregar depoimentos");
        } else if (testimonials) {
          setDepoimentos(testimonials);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`useConfiguracao - Alterando ${name} para ${value}`);
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    console.log(`useConfiguracao - Alterando switch ${name} para ${checked}`);
    setConfig(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveConfig = async () => {
    try {
      console.log("Salvando configurações:", config);
      
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
        cor_titulo: validateHex(config.cor_titulo) ? config.cor_titulo : "#000000", // Validate title color
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
      toast.success("Configurações salvas com sucesso!");
      
      // Recarregar a configuração para garantir que temos os dados mais recentes
      const { data: refreshedConfig, error: refreshError } = await supabase
        .from("config_checkout")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (refreshError) {
        console.error("Erro ao recarregar config após salvar:", refreshError);
      }  
      
      if (refreshedConfig && refreshedConfig.length > 0) {
        console.log("Configurações atualizadas após salvamento:", refreshedConfig[0]);
        setConfig(refreshedConfig[0]);
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    
    setDepoimentosSaving(true);
    try {
      const { error } = await supabase
        .from("depoimentos")
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDepoimentos(prev => prev.filter(dep => dep.id !== id));
      toast.success("Depoimento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      toast.error("Erro ao excluir depoimento. Tente novamente.");
    } finally {
      setDepoimentosSaving(false);
    }
  };

  const handleAddTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">) => {
    setDepoimentosSaving(true);
    try {
      const { data, error } = await supabase
        .from("depoimentos")
        .insert([depoimento])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setDepoimentos(prev => [data[0] as Depoimento, ...prev]);
        toast.success("Depoimento adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao adicionar depoimento:", error);
      toast.error("Erro ao adicionar depoimento. Tente novamente.");
    } finally {
      setDepoimentosSaving(false);
    }
  };

  return {
    config,
    loading,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleSaveConfig,
    handleDeleteTestimonial,
    handleAddTestimonial
  };
}
