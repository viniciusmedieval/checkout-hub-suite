
import { SupabaseClient } from '@supabase/supabase-js';
import { mockStorage, saveMockStorageToLocalStorage } from './storage-utils';

/**
 * Creates a mock Supabase client for development and testing when real Supabase is not available
 */
export function createMockClient(): SupabaseClient {
  console.log('Criando mock client para o Supabase');
  
  // Helper function to save changes to localStorage
  const saveToStorage = (table: string, data: any) => {
    if (!mockStorage[table]) {
      mockStorage[table] = [];
    }
    saveMockStorageToLocalStorage();
    return { data, error: null };
  };

  // Mock client implementation
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => {
        console.log(`Mock Supabase - Selecionando ${columns} da tabela ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock Supabase - Filtrando por ${column} = ${value}`);
            return {
              single: () => {
                const items = mockStorage[table] || [];
                const item = items.find((item: any) => item[column] === value);
                
                return {
                  data: item || null,
                  error: item ? null : new Error(`Item não encontrado com ${column}=${value}`)
                };
              },
              maybeSingle: () => {
                const items = mockStorage[table] || [];
                const item = items.find((item: any) => item[column] === value);
                
                return {
                  data: item || null,
                  error: null
                };
              }
            };
          },
          order: (column: string, { ascending }: { ascending: boolean }) => {
            console.log(`Mock Supabase - Ordenando por ${column}, ascending: ${ascending}`);
            return {
              limit: (limit: number) => {
                console.log(`Mock Supabase - Limitando a ${limit} resultados`);
                return {
                  single: () => {
                    const items = mockStorage[table] || [];
                    const sortedItems = [...items].sort((a, b) => {
                      if (ascending) {
                        return a[column] > b[column] ? 1 : -1;
                      } else {
                        return a[column] < b[column] ? 1 : -1;
                      }
                    });
                    
                    const limitedItems = sortedItems.slice(0, limit);
                    return {
                      data: limitedItems[0] || null,
                      error: limitedItems.length === 0 ? new Error('Nenhum item encontrado') : null
                    };
                  },
                  maybeSingle: () => {
                    const items = mockStorage[table] || [];
                    const sortedItems = [...items].sort((a, b) => {
                      if (ascending) {
                        return a[column] > b[column] ? 1 : -1;
                      } else {
                        return a[column] < b[column] ? 1 : -1;
                      }
                    });
                    
                    const limitedItems = sortedItems.slice(0, limit);
                    return {
                      data: limitedItems[0] || null,
                      error: null
                    };
                  }
                };
              }
            };
          }
        };
      },
      insert: (data: any[]) => {
        console.log(`Mock Supabase - Inserindo na tabela ${table}:`, data);
        
        if (!mockStorage[table]) {
          mockStorage[table] = [];
        }
        
        const newItems = data.map((item) => {
          // Generate random ID if doesn't exist
          const newItem = { ...item };
          if (!newItem.id) {
            newItem.id = Date.now() + Math.floor(Math.random() * 1000);
          }
          
          // Add timestamps if they don't exist
          if (!newItem.created_at) {
            newItem.created_at = new Date().toISOString();
          }
          
          return newItem;
        });
        
        mockStorage[table] = [...mockStorage[table], ...newItems];
        saveMockStorageToLocalStorage();
        
        return {
          data: null,
          error: null
        };
      },
      update: (data: any) => {
        console.log(`Mock Supabase - Atualizando tabela ${table}:`, data);
        
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock Supabase - Atualizando onde ${column} = ${value}`);
            
            if (!mockStorage[table]) {
              return { data: null, error: new Error(`Tabela ${table} não encontrada`) };
            }
            
            const items = mockStorage[table];
            const updatedItems = items.map((item: any) => {
              if (item[column] === value) {
                return { ...item, ...data, updated_at: new Date().toISOString() };
              }
              return item;
            });
            
            mockStorage[table] = updatedItems;
            saveMockStorageToLocalStorage();
            
            return {
              data: null,
              error: null
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock Supabase - Deletando da tabela ${table} onde ${column} = ${value}`);
            
            if (!mockStorage[table]) {
              return { data: null, error: null };
            }
            
            const items = mockStorage[table];
            const filteredItems = items.filter((item: any) => item[column] !== value);
            
            mockStorage[table] = filteredItems;
            saveMockStorageToLocalStorage();
            
            return {
              data: null,
              error: null
            };
          }
        };
      }
    }),
    storage: {
      from: (bucket: string) => ({
        // Implement storage methods if needed
        upload: (_path: string, _file: File) => Promise.resolve({ data: { path: 'mock-file-path' }, error: null }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: 'https://mock-url.com/mock-file.jpg' } })
      })
    },
    auth: {
      // Implement auth methods if needed
      signUp: () => Promise.resolve({ data: null, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    // Add other mock methods as needed
  } as unknown as SupabaseClient;
}
