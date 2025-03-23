
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Armazenamentos em memória para o cliente mock
const mockStorage = {
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

// Initialize the Supabase client with error handling
let supabase: SupabaseClient;

// Check if the required environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized with environment variables');
} else {
  console.warn('Supabase environment variables not found, using mock client');
  // Create a mock client that doesn't actually connect to Supabase
  // but provides the same interface and simulates storage in memory
  supabase = {
    from: (table: string) => {
      // Garantir que a tabela existe no storage mock
      if (!mockStorage[table as keyof typeof mockStorage]) {
        mockStorage[table as keyof typeof mockStorage] = [];
      }
      
      return {
        select: (columns?: string) => {
          const mockResult = {
            data: [...mockStorage[table as keyof typeof mockStorage]],
            error: null,
            eq: (column: string, value: any) => {
              const filtered = mockStorage[table as keyof typeof mockStorage].filter((item: any) => item[column] === value);
              return {
                data: filtered,
                error: null,
                gte: (column2: string, value2: any) => {
                  const filtered2 = filtered.filter((item: any) => item[column2] >= value2);
                  return {
                    lte: (column3: string, value3: any) => {
                      const filtered3 = filtered2.filter((item: any) => item[column3] <= value3);
                      return {
                        data: filtered3,
                        error: null
                      };
                    },
                    data: filtered2,
                    error: null
                  };
                },
                order: () => {
                  return {
                    limit: (limit: number) => {
                      return {
                        data: filtered.slice(0, limit),
                        error: null
                      };
                    },
                    data: filtered,
                    error: null
                  };
                }
              };
            },
            gte: (column: string, value: any) => {
              const filtered = mockStorage[table as keyof typeof mockStorage].filter((item: any) => item[column] >= value);
              return {
                lte: (column2: string, value2: any) => {
                  const filtered2 = filtered.filter((item: any) => item[column2] <= value2);
                  return {
                    data: filtered2,
                    error: null
                  };
                },
                data: filtered,
                error: null
              };
            },
            order: () => {
              return {
                limit: (limit: number) => {
                  return {
                    data: mockStorage[table as keyof typeof mockStorage].slice(0, limit),
                    error: null
                  };
                },
                data: mockStorage[table as keyof typeof mockStorage],
                error: null
              };
            }
          };
          
          return mockResult;
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
