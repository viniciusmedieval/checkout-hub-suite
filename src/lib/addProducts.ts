
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
    usar_api_pix: false,
    usar_config_pix_global: false,
  },
  {
    nome: "Plano Vitalício",
    tipo: "assinatura",
    valor: 29.90,
    descricao: "Acesso vitalício à plataforma, sem mensalidades.",
    ativo: true,
    slug: "plano-vitalicio",
    checkout_title: "Aproveite o Vitalício!",
    usar_api_pix: false,
    usar_config_pix_global: false,
  }
];

// Function to add products to Supabase
export const addProductsToSupabase = async () => {
  try {
    // Check if products already exist to avoid duplicates
    const { data: existingProducts, error: fetchError } = await supabase
      .from('produtos')
      .select('slug');
    
    if (fetchError) throw fetchError;
    
    const existingSlugs = existingProducts.map(product => product.slug);
    
    // Filter out products that already exist
    const newProducts = productsToAdd.filter(product => 
      !existingSlugs.includes(product.slug)
    );
    
    if (newProducts.length === 0) {
      console.log('All products already exist in the database.');
      return { success: true, message: 'All products already exist in the database.' };
    }
    
    // Insert new products
    const { data, error } = await supabase
      .from('produtos')
      .insert(newProducts)
      .select();
    
    if (error) throw error;
    
    console.log(`Added ${data.length} new products to the database.`);
    return { 
      success: true, 
      message: `Added ${data.length} new products to the database.`,
      addedProducts: data
    };
    
  } catch (error) {
    console.error('Error adding products:', error);
    return { 
      success: false, 
      message: `Error adding products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    };
  }
};
