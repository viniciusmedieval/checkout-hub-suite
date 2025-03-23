
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

  // Fetch configuration data from Supabase
  useEffect(() => {
    const fetchConfigData = async () => {
      setLoading(true);
      try {
        // Fetch checkout configuration
        const { data: checkoutConfig, error: configError } = await supabase
          .from("config_checkout")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (configError) {
          console.error("Erro ao carregar configurações do checkout:", configError);
          toast.error("Erro ao carregar configurações do checkout");
        } else if (checkoutConfig && checkoutConfig.length > 0) {
          setConfig(checkoutConfig[0]);
        }
        
        // Fetch testimonials
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
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveConfig = async () => {
    try {
      let result;
      
      if (config.id) {
        // Update existing record
        result = await supabase
          .from("config_checkout")
          .update({
            mensagem_topo: config.mensagem_topo,
            cor_topo: config.cor_topo,
            ativa_banner: config.ativa_banner,
            banner_url: config.banner_url,
            banner_mobile_url: config.banner_mobile_url,
            cor_banner: config.cor_banner,
            cor_fundo: config.cor_fundo,
            texto_botao: config.texto_botao,
            rodape_texto: config.rodape_texto,
            rodape_empresa: config.rodape_empresa,
            rodape_ano: config.rodape_ano,
            mostrar_seguro: config.mostrar_seguro,
            mensagem_rodape: config.mensagem_rodape
          })
          .eq('id', config.id);
      } else {
        // Insert new record
        result = await supabase
          .from("config_checkout")
          .insert([{
            mensagem_topo: config.mensagem_topo,
            cor_topo: config.cor_topo,
            ativa_banner: config.ativa_banner,
            banner_url: config.banner_url,
            banner_mobile_url: config.banner_mobile_url,
            cor_banner: config.cor_banner,
            cor_fundo: config.cor_fundo,
            texto_botao: config.texto_botao,
            rodape_texto: config.rodape_texto,
            rodape_empresa: config.rodape_empresa,
            rodape_ano: config.rodape_ano,
            mostrar_seguro: config.mostrar_seguro,
            mensagem_rodape: config.mensagem_rodape
          }]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    }
  };

  // Function to handle testimonial deletion
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

  // Function to handle adding new testimonials
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
