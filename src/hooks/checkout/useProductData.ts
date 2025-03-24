
import { useState } from "react";
import { Produto, supabase } from "@/lib/supabase";
import { useMockProducts } from "./useMockProducts";

export const useProductData = () => {
  const { findMockProductBySlug } = useMockProducts();

  const fetchProductBySlug = async (slug: string): Promise<{ produto: Produto | null, error: string | null }> => {
    try {
      console.log("useProductData - Buscando produto com slug:", slug);
      
      // Verificar se o cliente Supabase está inicializado
      if (!supabase) {
        console.error("useProductData - Cliente Supabase não inicializado, usando dados mockados");
        throw new Error("Cliente Supabase não inicializado");
      }
      
      // Try to get product from Supabase
      const { data: productData, error: productError } = await supabase
        .from("produtos")
        .select("*")
        .eq("slug", slug)
        .eq("ativo", true)
        .maybeSingle();

      console.log("useProductData - Resposta do Supabase produtos:", { productData, productError });
      
      if (productError) {
        console.error("useProductData - Erro do Supabase:", productError);
        throw productError;
      }
      
      if (!productData) {
        // Recupera dados do localStorage como fallback
        console.log("useProductData - Produto não encontrado no Supabase, tentando mock data");
        const mockProduct = findMockProductBySlug(slug);
        
        if (mockProduct) {
          return { produto: mockProduct, error: null };
        }
        
        return { produto: null, error: "Produto não encontrado" };
      }
      
      console.log("useProductData - Produto encontrado no Supabase:", productData);
      return { produto: productData, error: null };
      
    } catch (error: any) {
      console.error("useProductData - Erro ao buscar produto:", error);
      
      // Tentar usar dados mock em caso de erro de conexão
      console.log("useProductData - Tentando recuperar de dados mockados após erro");
      const mockProduct = findMockProductBySlug(slug);
      
      if (mockProduct) {
        return { produto: mockProduct, error: null };
      }
      
      return { 
        produto: null, 
        error: error?.message || "Erro ao carregar o produto. Tente novamente mais tarde." 
      };
    }
  };

  return {
    fetchProductBySlug
  };
};
