
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
      
      const { data: checkoutConfig, error: configError } = await supabase
        .from("config_checkout")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (configError) {
        console.error("useCheckoutData - Erro ao carregar configurações do checkout:", configError);
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
          
          console.log("useCheckoutData - Cores validadas:", {
            corTopo: config.cor_topo,
            corFundo: config.cor_fundo,
            corBanner: config.cor_banner
          });
          
          setConfigCheckout(config);
        }
      } else {
        console.log("useCheckoutData - Nenhuma configuração encontrada");
      }
    } catch (error) {
      console.error("useCheckoutData - Erro ao buscar configuração do checkout:", error);
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
        
        // Try to get product from Supabase
        const { data: productData, error: productError } = await supabase
          .from("produtos")
          .select("*")
          .eq("slug", slug)
          .eq("ativo", true)
          .single();

        console.log("useCheckoutData - Resposta do Supabase produtos:", { productData, productError });
        
        if (productError) {
          console.error("useCheckoutData - Erro do Supabase:", productError);
          throw productError;
        }
        
        if (!productData) {
          // Recupera dados do localStorage como fallback
          console.log("useCheckoutData - Produto não encontrado no Supabase, tentando localStorage");
          const mockStorage = localStorage.getItem('mockSupabaseStorage');
          if (mockStorage) {
            const parsedStorage = JSON.parse(mockStorage);
            if (parsedStorage && parsedStorage.produtos) {
              console.log("useCheckoutData - Dados mockStorage encontrados:", parsedStorage.produtos);
              const produtoEncontrado = parsedStorage.produtos.find(
                (p: Produto) => p.slug === slug && p.ativo
              );
              
              if (produtoEncontrado) {
                console.log("useCheckoutData - Produto encontrado nos dados mockStorage:", produtoEncontrado);
                setProduto(produtoEncontrado);
                setLoading(false);
                return;
              }
            }
          }
          
          setError("Produto não encontrado");
        } else {
          console.log("useCheckoutData - Produto encontrado no Supabase:", productData);
          setProduto(productData);
        }
      } catch (error) {
        console.error("useCheckoutData - Erro ao buscar produto:", error);
        setError("Erro ao carregar o produto. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [slug]);

  return { produto, configCheckout, loading, error };
};
