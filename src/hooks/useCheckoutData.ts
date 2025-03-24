
import { useState, useEffect } from "react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { useCheckoutConfig } from "./checkout/useCheckoutConfig";
import { useProductData } from "./checkout/useProductData";

export const useCheckoutData = (slug: string | undefined) => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { configCheckout, fetchCheckoutConfig } = useCheckoutConfig();
  const { fetchProductBySlug } = useProductData();

  useEffect(() => {
    const fetchProduto = async () => {
      if (!slug) {
        setError("Produto não encontrado");
        setLoading(false);
        return;
      }

      try {
        console.log("useCheckoutData - Iniciando carregamento do produto e configurações");
        
        // Carregar a configuração do checkout primeiro
        await fetchCheckoutConfig();
        
        // Buscar o produto pelo slug
        const { produto: produtoData, error: produtoError } = await fetchProductBySlug(slug);
        
        if (produtoError) {
          setError(produtoError);
        } else if (produtoData) {
          setProduto(produtoData);
        } else {
          setError("Produto não encontrado");
        }
      } catch (error: any) {
        console.error("useCheckoutData - Erro fatal:", error);
        setError(error?.message || "Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [slug]);

  return { produto, configCheckout, loading, error };
};
