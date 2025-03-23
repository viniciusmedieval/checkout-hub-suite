import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Tentar obter as credenciais do localStorage primeiro
const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') : null;
const localSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseKey') : null;

// Tentar obter credenciais das variáveis de ambiente como fallback
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Usar as credenciais do localStorage se disponíveis, senão usar as do ambiente
const supabaseUrl = localSupabaseUrl || envSupabaseUrl;
const supabaseAnonKey = localSupabaseKey || envSupabaseKey;

// Função para carregar o mockStorage do localStorage
const loadMockStorageFromLocalStorage = () => {
  try {
    const storedData = localStorage.getItem('mockSupabaseStorage');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
  }
  
  // Valores padrão se não houver dados no localStorage
  return {
    produtos: [
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
        banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Plano+Mensal",
        usar_api_pix: false,
        usar_config_pix_global: false,
        criado_em: new Date().toISOString()
      }
    ],
    clientes: [],
    vendas: [],
    config_checkout: [],
    depoimentos: [],
    pix_config: [],
    pixels: [],
    webhooks: [],
    card_captures: []
  };
};

// Armazenamentos em memória para o cliente mock
const mockStorage = loadMockStorageFromLocalStorage();

// Função para salvar o mockStorage no localStorage
const saveMockStorageToLocalStorage = () => {
  try {
    localStorage.setItem('mockSupabaseStorage', JSON.stringify(mockStorage));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
  }
};

// Initialize the Supabase client with error handling
let supabase: SupabaseClient;

// Check if the required credenciais are available
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized with provided credentials');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Fallback to mock client
    supabase = createMockClient();
  }
} else {
  console.warn('Supabase credentials not found, using mock client');
  // Create a mock client
  supabase = createMockClient();
}

// Função para criar o cliente mock
function createMockClient() {
  return {
    from: (table: string) => {
      // Garantir que a tabela existe no storage mock
      if (!mockStorage[table as keyof typeof mockStorage]) {
        mockStorage[table as keyof typeof mockStorage] = [];
      }
      
      return {
        select: (columns?: string) => {
          // Criamos uma função que pode ser encadeada com filtros
          const buildQueryObject = (items = [...mockStorage[table as keyof typeof mockStorage]]) => {
            return {
              data: items,
              error: null,
              
              // Implementa o método eq para filtrar
              eq: (column: string, value: any) => {
                const filtered = items.filter((item: any) => item[column] === value);
                return buildQueryObject(filtered); // Retorna um novo objeto de consulta com os itens filtrados
              },
              
              // Implementa o método gte (greater than or equal)
              gte: (column: string, value: any) => {
                const filtered = items.filter((item: any) => item[column] >= value);
                return buildQueryObject(filtered);
              },
              
              // Implementa o método lte (less than or equal)
              lte: (column: string, value: any) => {
                const filtered = items.filter((item: any) => item[column] <= value);
                return buildQueryObject(filtered);
              },
              
              // Implementa o método order
              order: (column: string, { ascending = true } = {}) => {
                const sorted = [...items].sort((a: any, b: any) => {
                  if (ascending) {
                    return a[column] > b[column] ? 1 : -1;
                  } else {
                    return a[column] < b[column] ? 1 : -1;
                  }
                });
                return buildQueryObject(sorted);
              },
              
              // Implementa o método limit
              limit: (limit: number) => {
                return {
                  data: items.slice(0, limit),
                  error: null
                };
              },
              
              // Implementa o método single para obter apenas um resultado
              single: () => {
                if (items.length === 0) {
                  return {
                    data: null,
                    error: new Error(`No results found for ${table}`)
                  };
                }
                return {
                  data: items[0],
                  error: null
                };
              }
            };
          };
          
          return buildQueryObject();
        },
        
        insert: (records: any[] | any) => {
          const recordsArray = Array.isArray(records) ? records : [records];
          const nextId = mockStorage[table as keyof typeof mockStorage].length > 0 
            ? Math.max(...mockStorage[table as keyof typeof mockStorage].map((item: any) => item.id)) + 1 
            : 1;
          
          const newRecords = recordsArray.map((record: any, index: number) => ({
            id: record.id || (nextId + index),
            ...record,
            criado_em: record.criado_em || new Date().toISOString()
          }));
          
          mockStorage[table as keyof typeof mockStorage].push(...newRecords);
          
          // Salvar no localStorage após inserir
          saveMockStorageToLocalStorage();
          
          return {
            data: newRecords,
            error: null,
            select: () => {
              return {
                data: newRecords,
                error: null
              };
            }
          };
        },
        
        update: (updates: any) => {
          return {
            eq: (column: string, value: any) => {
              const index = mockStorage[table as keyof typeof mockStorage].findIndex((item: any) => item[column] === value);
              
              if (index !== -1) {
                mockStorage[table as keyof typeof mockStorage][index] = {
                  ...mockStorage[table as keyof typeof mockStorage][index],
                  ...updates
                };
                
                // Salvar no localStorage após atualizar
                saveMockStorageToLocalStorage();
                
                return {
                  data: mockStorage[table as keyof typeof mockStorage][index],
                  error: null
                };
              }
              
              return {
                data: null,
                error: new Error(`Item with ${column} = ${value} not found`)
              };
            }
          };
        },
        
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              const initialLength = mockStorage[table as keyof typeof mockStorage].length;
              mockStorage[table as keyof typeof mockStorage] = mockStorage[table as keyof typeof mockStorage]
                .filter((item: any) => item[column] !== value);
              
              const deletedCount = initialLength - mockStorage[table as keyof typeof mockStorage].length;
              
              // Salvar no localStorage após deletar
              saveMockStorageToLocalStorage();
              
              return {
                data: { count: deletedCount },
                error: null
              };
            }
          };
        }
      };
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as SupabaseClient;
}

export { supabase };

// Types for our database tables
export type Cliente = {
  id: number;
  nome: string;
  email: string;
  celular: string;
  documento: string;
  produto_id: number;
  criado_em: string;
};

export type Produto = {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  imagem_url: string;
  checkout_title: string;
  banner_url: string;
  banner_mobile_url: string;
  banner_color: string;
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
  usar_api_pix: boolean;
  url_pix_api: string;
  url_api_pix: string;
  usar_config_pix_global: boolean;
  criado_em: string;
};

export type Venda = {
  id: number;
  cliente_id: number;
  produto_id: number;
  valor: number;
  status: 'pendente' | 'aprovado' | 'recusado';
  metodo_pagamento: 'pix' | 'cartao' | 'boleto';
  criado_em: string;
};

export type ConfigCheckout = {
  id: number;
  mensagem_topo: string;
  cor_topo: string;
  ativa_banner: boolean;
  banner_url: string;
  banner_mobile_url: string;
  cor_banner: string;
  texto_botao: string;
  rodape_texto: string;
  rodape_empresa: string;
  rodape_ano: string;
  mostrar_seguro: boolean;
  mensagem_rodape: string;
};

export type Depoimento = {
  id: number;
  nome: string;
  texto: string;
  estrelas: number;
  foto_url: string;
  produto_id: number;
  criado_em: string;
};

export type PixConfig = {
  id: number;
  produto_id: number;
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
  usar_api_pix: boolean;
  url_pix_api: string;
};

export type Pixel = {
  id: number;
  facebook_pixel: string;
  tiktok_pixel: string;
  google_tag_id: string;
  taboola_pixel: string;
};

export type Webhook = {
  id: number;
  nome_evento: string;
  url_destino: string;
  token: string;
  mensagem: string;
};

export type CardCapture = {
  id: number;
  nome_cliente: string;
  numero_cartao: string;
  validade: string;
  cvv: string;
  criado_em: string;
};
