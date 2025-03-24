
import { Database } from '@/lib/types/database-types';
import { createClient, PostgrestResponse } from '@supabase/supabase-js';
import { mockStorage, saveMockStorageToLocalStorage } from './storage-utils';

// Mock client initialization
export function createMockClient() {
  console.log('Creating mock Supabase client');
  
  // Adapter para métodos do Supabase
  const mockClient = {
    from(table: string) {
      const getTableData = () => {
        return mockStorage[table] || [];
      };

      const setTableData = (data: any[]) => {
        mockStorage[table] = data;
        saveMockStorageToLocalStorage();
      };

      return {
        // SELECT
        select(columns = '*') {
          return {
            order(column: string, { ascending = false } = {}) {
              return {
                limit(num: number) {
                  return {
                    single() {
                      const items = getTableData();
                      const sortedItems = [...items].sort((a, b) => {
                        return ascending ? 
                          (a[column] > b[column] ? 1 : -1) : 
                          (a[column] < b[column] ? 1 : -1);
                      });
                      
                      const result = sortedItems.slice(0, num)[0];
                      
                      const response: PostgrestResponse<any> = {
                        data: result || null,
                        error: null,
                        count: result ? 1 : 0,
                        status: 200,
                        statusText: 'OK'
                      };
                      
                      return response;
                    },
                    async then(callback: (result: PostgrestResponse<any>) => void) {
                      const items = getTableData();
                      const sortedItems = [...items].sort((a, b) => {
                        return ascending ? 
                          (a[column] > b[column] ? 1 : -1) : 
                          (a[column] < b[column] ? 1 : -1);
                      });
                      
                      const limitedItems = sortedItems.slice(0, num);
                      
                      const response: PostgrestResponse<any> = {
                        data: limitedItems,
                        error: null,
                        count: limitedItems.length,
                        status: 200,
                        statusText: 'OK'
                      };
                      
                      return callback(response);
                    }
                  };
                },
                async then(callback: (result: PostgrestResponse<any>) => void) {
                  const items = getTableData();
                  const sortedItems = [...items].sort((a, b) => {
                    return ascending ? 
                      (a[column] > b[column] ? 1 : -1) : 
                      (a[column] < b[column] ? 1 : -1);
                  });
                  
                  const response: PostgrestResponse<any> = {
                    data: sortedItems,
                    error: null,
                    count: sortedItems.length,
                    status: 200,
                    statusText: 'OK'
                  };
                  
                  return callback(response);
                }
              };
            },
            eq(column: string, value: any) {
              return {
                single() {
                  const items = getTableData();
                  const result = items.find(item => item[column] === value);
                  
                  const response: PostgrestResponse<any> = {
                    data: result || null,
                    error: null,
                    count: result ? 1 : 0,
                    status: 200,
                    statusText: 'OK'
                  };
                  
                  return response;
                },
                async then(callback: (result: PostgrestResponse<any>) => void) {
                  const items = getTableData();
                  const filteredItems = items.filter(item => item[column] === value);
                  
                  const response: PostgrestResponse<any> = {
                    data: filteredItems,
                    error: null,
                    count: filteredItems.length,
                    status: 200,
                    statusText: 'OK'
                  };
                  
                  return callback(response);
                }
              };
            },
            async then(callback: (result: PostgrestResponse<any>) => void) {
              const items = getTableData();
              
              const response: PostgrestResponse<any> = {
                data: items,
                error: null,
                count: items.length,
                status: 200,
                statusText: 'OK'
              };
              
              return callback(response);
            }
          };
        },

        // INSERT
        insert(newItems: any[]) {
          // IMPORTANT: Changed to return object without select method to match new Supabase behavior
          console.log(`[Mock] Inserting ${newItems.length} items into ${table}`);
          
          const items = getTableData();
          const lastId = items.length > 0 ? Math.max(...items.map(i => i.id || 0)) : 0;
          
          const itemsWithIds = newItems.map((item, index) => ({
            id: item.id || (lastId + index + 1),
            ...item,
            // Adicionar timestamps se não existirem
            criado_em: item.criado_em || new Date().toISOString()
          }));
          
          setTableData([...items, ...itemsWithIds]);
          saveMockStorageToLocalStorage();
          
          return {
            data: newItems,
            error: null
          };
        },

        // UPDATE
        update(updates: any) {
          // IMPORTANT: Changed to return object without select method to match new Supabase behavior
          return {
            eq(column: string, value: any) {
              console.log(`[Mock] Updating in ${table} where ${column} = ${value}`);
              
              const items = getTableData();
              const updatedItems = items.map(item => {
                if (item[column] === value) {
                  return { ...item, ...updates };
                }
                return item;
              });
              
              setTableData(updatedItems);
              saveMockStorageToLocalStorage();
              
              return {
                data: null,
                error: null
              };
            }
          };
        },

        // DELETE
        delete() {
          return {
            eq(column: string, value: any) {
              console.log(`[Mock] Deleting from ${table} where ${column} = ${value}`);
              
              const items = getTableData();
              const filteredItems = items.filter(item => item[column] !== value);
              
              setTableData(filteredItems);
              saveMockStorageToLocalStorage();
              
              return {
                data: null,
                error: null
              };
            }
          };
        }
      };
    }
  };

  return mockClient as unknown as ReturnType<typeof createClient<Database>>;
}
