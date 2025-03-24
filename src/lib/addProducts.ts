
import { supabase } from './supabase';

// Define the product structure
interface ProductToAdd {
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  checkout_title: string;
  imagem_url?: string;
  banner_url?: string;
  banner_mobile_url?: string;
  banner_color?: string;
  tipo_chave_pix?: string;
  chave_pix?: string;
  nome_beneficiario?: string;
  usar_api_pix: boolean;
  usar_config_pix_global: boolean;
}

// The products to be added
const productsToAdd: ProductToAdd[] = [
  {
    nome: "Plano Mensal",
    tipo: "assinatura",
    valor: 14.90,
    descricao: "Acesso total à plataforma por 30 dias.",
    ativo: true,
    slug: "plano-mensal",
    checkout_title: "Assine o Plano Mensal",
    imagem_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Plano+Mensal",
    usar_api_pix: false,
    usar_config_pix_global: false,
  },
  {
    nome: "Plano Trimestral",
    tipo: "assinatura",
    valor: 39.90,
    descricao: "Acesso total à plataforma por 3 meses.",
    ativo: true,
    slug: "plano-trimestral",
    checkout_title: "Assine o Plano Trimestral",
    imagem_url: "https://placehold.co/600x400/22c55e/FFFFFF/png?text=Plano+Trimestral",
    usar_api_pix: false,
    usar_config_pix_global: false,
  },
  {
    nome: "Plano Semestral",
    tipo: "assinatura",
    valor: 69.90,
    descricao: "Acesso total à plataforma por 6 meses.",
    ativo: true,
    slug: "plano-semestral",
    checkout_title: "Assine o Plano Semestral",
    imagem_url: "https://placehold.co/600x400/a855f7/FFFFFF/png?text=Plano+Semestral",
    usar_api_pix: false,
    usar_config_pix_global: false,
  },
  {
    nome: "Plano Vitalício",
    tipo: "assinatura",
    valor: 299.90,
    descricao: "Acesso vitalício à plataforma, sem mensalidades.",
    ativo: true,
    slug: "plano-vitalicio",
    checkout_title: "Aproveite o Vitalício!",
    imagem_url: "https://placehold.co/600x400/ec4899/FFFFFF/png?text=Plano+Vitalício",
    usar_api_pix: false,
    usar_config_pix_global: false,
  }
];

// Function to add products to Supabase
export const addProductsToSupabase = async () => {
  try {
    // Atualiza o localStorage primeiro
    try {
      const mockStorageStr = localStorage.getItem('mockSupabaseStorage');
      const mockStorage = mockStorageStr ? JSON.parse(mockStorageStr) : { produtos: [] };
      
      if (!mockStorage.produtos) {
        mockStorage.produtos = [];
      }
      
      // Obtém slugs existentes para evitar duplicações
      const existingSlugs = mockStorage.produtos.map((p: any) => p.slug);
      
      // Apenas adiciona produtos que ainda não existem
      const novoProdutos = productsToAdd.filter(p => !existingSlugs.includes(p.slug));
      
      if (novoProdutos.length > 0) {
        // Adiciona IDs aos novos produtos
        const ultimoId = mockStorage.produtos.length > 0 
          ? Math.max(...mockStorage.produtos.map((p: any) => p.id)) 
          : 0;
        
        const produtosComId = novoProdutos.map((p, index) => ({
          ...p,
          id: ultimoId + index + 1,
          criado_em: new Date().toISOString()
        }));
        
        // Adiciona ao array de produtos
        mockStorage.produtos.push(...produtosComId);
        
        // Salva no localStorage
        localStorage.setItem('mockSupabaseStorage', JSON.stringify(mockStorage));
        console.log(`${produtosComId.length} produtos adicionados ao localStorage`);
      }
    } catch (localStorageError) {
      console.error("Erro ao atualizar localStorage:", localStorageError);
    }
    
    // Continua com o código original que tenta salvar no Supabase
    const { data, error: fetchError } = await supabase
      .from('produtos')
      .select('slug');
    
    if (fetchError) throw fetchError;
    
    // Explicitly ensure we have an array, even if data is null or undefined
    const existingProducts = Array.isArray(data) ? data : [];
    const existingSlugs = existingProducts.map(product => product.slug);
    
    // Filter out products that already exist
    const newProducts = productsToAdd.filter(product => 
      !existingSlugs.includes(product.slug)
    );
    
    if (newProducts.length === 0) {
      console.log('All products already exist in the database.');
      return { success: true, message: 'Todos os produtos já existem no banco de dados.' };
    }
    
    // Insert new products - Fix: removed .select() after insert
    const { error } = await supabase
      .from('produtos')
      .insert(newProducts);
    
    if (error) throw error;
    
    // Separate query to get the inserted products
    const { data: insertedData, error: selectError } = await supabase
      .from('produtos')
      .select('*')
      .in('slug', newProducts.map(p => p.slug));
      
    if (selectError) {
      console.error("Erro ao buscar produtos inseridos:", selectError);
      console.log(`Added ${newProducts.length} new products to the database, but couldn't fetch them.`);
      return { 
        success: true, 
        message: `Adicionados ${newProducts.length} novos produtos ao banco de dados.`,
        addedProducts: newProducts
      };
    }
    
    if (!insertedData) {
      console.error("Erro: Retorno nulo do Supabase após inserção de produtos");
      return { 
        success: true, 
        message: `Adicionados ${newProducts.length} novos produtos ao banco de dados.`,
        addedProducts: newProducts
      };
    }
    
    console.log(`Added ${insertedData.length} new products to the database.`);
    return { 
      success: true, 
      message: `Adicionados ${insertedData.length} novos produtos ao banco de dados.`,
      addedProducts: insertedData
    };
    
  } catch (error) {
    console.error('Error adding products:', error);
    return { 
      success: false, 
      message: `Erro ao adicionar produtos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
};
