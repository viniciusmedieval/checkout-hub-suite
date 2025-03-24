
import { SupabaseClient } from '@supabase/supabase-js';
import { mockStorage, saveMockStorageToLocalStorage } from './storage-utils';

// Função para criar o cliente mock
export function createMockClient(): SupabaseClient {
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
              
              // Implementa o método in para filtrar por valores em um array
              in: (column: string, values: any[]) => {
                const filtered = items.filter((item: any) => values.includes(item[column]));
                return buildQueryObject(filtered);
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
                return buildQueryObject(items.slice(0, limit));
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
            error: null
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
