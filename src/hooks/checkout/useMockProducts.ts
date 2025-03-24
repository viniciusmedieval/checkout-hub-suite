
import { Produto } from "@/lib/supabase";

export const useMockProducts = () => {
  const getMockProducts = (): Produto[] => {
    console.log("useMockProducts - Tentando carregar produtos mock");
    
    try {
      const mockStorage = localStorage.getItem('mockSupabaseStorage');
      if (mockStorage) {
        const parsedStorage = JSON.parse(mockStorage);
        if (parsedStorage && parsedStorage.produtos) {
          console.log("useMockProducts - Dados mockStorage encontrados:", parsedStorage.produtos);
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
      console.error("useMockProducts - Erro ao obter produtos mock:", error);
      return [];
    }
  };
  
  const findMockProductBySlug = (slug: string): Produto | null => {
    console.log("useMockProducts - Tentando encontrar produto mock com slug:", slug);
    
    const mockProducts = getMockProducts();
    const produtoEncontrado = mockProducts.find(
      (p: Produto) => p.slug === slug && p.ativo
    );
    
    if (produtoEncontrado) {
      console.log("useMockProducts - Produto encontrado nos dados mockados:", produtoEncontrado);
      return produtoEncontrado;
    }
    
    return null;
  };

  return {
    getMockProducts,
    findMockProductBySlug
  };
};
