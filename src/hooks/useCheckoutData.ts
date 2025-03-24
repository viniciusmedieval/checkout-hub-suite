
import { useState, useEffect } from "react";
import { Produto, supabase, ConfigCheckout } from "@/lib/supabase";

export const useCheckoutData = (slug: string | undefined) => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [configCheckout, setConfigCheckout] = useState<ConfigCheckout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar a configuração do checkout
  const fetchCheckoutConfig = async () => {
    try {
      console.log("useCheckoutData - Buscando configuração do checkout...");
      
      // Verificar se o cliente Supabase está inicializado
      if (!supabase) {
        console.error("useCheckoutData - Cliente Supabase não inicializado");
        throw new Error("Cliente Supabase não inicializado");
      }
      
      const { data: checkoutConfig, error: configError } = await supabase
        .from("config_checkout")
        .select("*")
        .order('criado_em', { ascending: false })
        .limit(1);
        
      if (configError) {
        console.error("useCheckoutData - Erro ao carregar configurações do checkout:", configError);
        // Continuamos sem definir erro, apenas logar para não interromper o fluxo
      } else if (checkoutConfig && checkoutConfig.length > 0) {
        console.log("useCheckoutData - Config carregada:", checkoutConfig[0]);
        
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
          
          console.log("useCheckoutData - Cores validadas:", {
            corTopo: config.cor_topo,
            corFundo: config.cor_fundo,
            corBanner: config.cor_banner,
            corTitulo: config.cor_titulo,
            corBotao: config.cor_botao,
            corTextoBotao: config.cor_texto_botao,
            corTextoContador: config.cor_texto_contador
          });
          
          setConfigCheckout(config);
        }
      } else {
        console.log("useCheckoutData - Nenhuma configuração encontrada");
        // Definir configuração padrão como fallback
        setConfigCheckout({
          id: 0,
          cor_topo: "#3b82f6",
          cor_fundo: "#FFFFFF",
          cor_banner: "#3b82f6",
          cor_titulo: "#000000",
          cor_botao: "#8B5CF6",
          cor_texto_botao: "#FFFFFF",
          cor_texto_contador: "#4B5563",
          mensagem_topo: "Oferta por tempo limitado!",
          texto_botao: "Finalizar Compra",
          rodape_texto: "Todos os direitos reservados",
          rodape_empresa: "Sua Empresa",
          rodape_ano: new Date().getFullYear().toString(),
          mostrar_seguro: true,
          ativa_banner: true
        } as ConfigCheckout);
      }
    } catch (error) {
      console.error("useCheckoutData - Erro ao buscar configuração do checkout:", error);
      // Definir configuração padrão em caso de erro
      setConfigCheckout({
        id: 0,
        cor_topo: "#3b82f6",
        cor_fundo: "#FFFFFF",
        cor_banner: "#3b82f6",
        cor_titulo: "#000000",
        cor_botao: "#8B5CF6",
        cor_texto_botao: "#FFFFFF",
        cor_texto_contador: "#4B5563",
        mensagem_topo: "Oferta por tempo limitado!",
        texto_botao: "Finalizar Compra",
        rodape_texto: "Todos os direitos reservados",
        rodape_empresa: "Sua Empresa",
        rodape_ano: new Date().getFullYear().toString(),
        mostrar_seguro: true,
        ativa_banner: true
      } as ConfigCheckout);
    }
  };

  // Função para buscar produto mock para testes
  const getMockProducts = () => {
    console.log("useCheckoutData - Tentando carregar produto mock com slug:", slug);
    
    try {
      const mockStorage = localStorage.getItem('mockSupabaseStorage');
      if (mockStorage) {
        const parsedStorage = JSON.parse(mockStorage);
        if (parsedStorage && parsedStorage.produtos) {
          console.log("useCheckoutData - Dados mockStorage encontrados:", parsedStorage.produtos);
          return parsedStorage.produtos;
        }
      }
      
      // Dados de produtos mockados como último recurso
      return [
        {
          id: 1,
          nome: "Plano Mensal",
          tipo: "assinatura",
          valor: 14.90,
          descricao: "Acesso total à plataforma por 30 dias.",
          ativo: true,
          slug: "plano-mensal",
          checkout_title: "Assine o Plano Mensal",
          imagem_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Plano+Mensal",
          banner_url: null,
          banner_mobile_url: null,
          banner_color: null,
          background_color: null,
          tipo_chave_pix: null,
          chave_pix: null,
          nome_beneficiario: null,
          usar_api_pix: false,
          url_pix_api: null,
          usar_config_pix_global: false,
          criado_em: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error("useCheckoutData - Erro ao obter produtos mock:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProduto = async () => {
      if (!slug) {
        setError("Produto não encontrado");
        setLoading(false);
        return;
      }

      try {
        console.log("useCheckoutData - Buscando produto com slug:", slug);
        
        // Carregar a configuração do checkout primeiro
        await fetchCheckoutConfig();
        
        // Verificar se o cliente Supabase está inicializado
        if (!supabase) {
          console.error("useCheckoutData - Cliente Supabase não inicializado, usando dados mockados");
          throw new Error("Cliente Supabase não inicializado");
        }
        
        // Try to get product from Supabase
        const { data: productData, error: productError } = await supabase
          .from("produtos")
          .select("*")
          .eq("slug", slug)
          .eq("ativo", true)
          .maybeSingle();

        console.log("useCheckoutData - Resposta do Supabase produtos:", { productData, productError });
        
        if (productError) {
          console.error("useCheckoutData - Erro do Supabase:", productError);
          throw productError;
        }
        
        if (!productData) {
          // Recupera dados do localStorage como fallback
          console.log("useCheckoutData - Produto não encontrado no Supabase, tentando mock data");
          const mockProducts = getMockProducts();
          const produtoEncontrado = mockProducts.find(
            (p: Produto) => p.slug === slug && p.ativo
          );
          
          if (produtoEncontrado) {
            console.log("useCheckoutData - Produto encontrado nos dados mockados:", produtoEncontrado);
            setProduto(produtoEncontrado);
            setLoading(false);
            return;
          }
          
          setError("Produto não encontrado");
        } else {
          console.log("useCheckoutData - Produto encontrado no Supabase:", productData);
          setProduto(productData);
        }
      } catch (error) {
        console.error("useCheckoutData - Erro ao buscar produto:", error);
        
        // Tentar usar dados mock em caso de erro de conexão
        console.log("useCheckoutData - Tentando recuperar de dados mockados após erro");
        const mockProducts = getMockProducts();
        const produtoEncontrado = mockProducts.find(
          (p: Produto) => p.slug === slug && p.ativo
        );
        
        if (produtoEncontrado) {
          console.log("useCheckoutData - Produto encontrado nos dados mockados após erro:", produtoEncontrado);
          setProduto(produtoEncontrado);
          setLoading(false);
          return;
        }
        
        setError("Erro ao carregar o produto. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [slug]);

  return { produto, configCheckout, loading, error };
};
