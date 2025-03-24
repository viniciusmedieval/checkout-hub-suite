
import { mockStorage, saveMockStorageToLocalStorage } from './storage-utils';
import { SupabaseResponse, SupabaseSingleResponse, ErrorResponse } from './types';

// Helper for select operations
export function createSelectOperation(table: string) {
  console.log(`Mock client: ${table}.select()`);
  
  return {
    eq: (column: string, value: any) => {
      console.log(`Mock client: ${table}.select().eq(${column}, ${value})`);
      const data = mockStorage[table] || [];
      let filteredData = data.filter((row: any) => row[column] === value);
      
      return {
        single: () => {
          console.log(`Mock client: ${table}.select().eq().single()`);
          const result = filteredData.length > 0 ? filteredData[0] : null;
          
          return {
            data: result,
            error: result ? null : { message: 'No rows found' }
          };
        },
        maybeSingle: () => {
          console.log(`Mock client: ${table}.select().eq().maybeSingle()`);
          const result = filteredData.length > 0 ? filteredData[0] : null;
          
          return {
            data: result,
            error: null
          };
        },
        then: (callback: (value: SupabaseResponse<any[]>) => any) => {
          return Promise.resolve({
            data: filteredData,
            error: null
          }).then(callback);
        }
      };
    },
    order: (column: string, { ascending = true } = {}) => {
      console.log(`Mock client: ${table}.select().order(${column}, ${ascending})`);
      const data = mockStorage[table] || [];
      
      // Sort the data based on the column and order
      const sortedData = [...data].sort((a, b) => {
        if (ascending) {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
      
      return {
        limit: (limit: number) => {
          console.log(`Mock client: ${table}.select().order().limit(${limit})`);
          const limitedData = sortedData.slice(0, limit);
          
          return {
            single: () => {
              console.log(`Mock client: ${table}.select().order().limit().single()`);
              const result = limitedData.length > 0 ? limitedData[0] : null;
              
              return {
                data: result,
                error: result ? null : { message: 'No rows found' }
              };
            },
            then: (callback: (value: SupabaseResponse<any[]>) => any) => {
              return Promise.resolve({
                data: limitedData,
                error: null
              }).then(callback);
            }
          };
        },
        then: (callback: (value: SupabaseResponse<any[]>) => any) => {
          return Promise.resolve({
            data: sortedData,
            error: null
          }).then(callback);
        }
      };
    },
    limit: (limit: number) => {
      console.log(`Mock client: ${table}.select().limit(${limit})`);
      const data = mockStorage[table] || [];
      const limitedData = data.slice(0, limit);
      
      return {
        then: (callback: (value: SupabaseResponse<any[]>) => any) => {
          return Promise.resolve({
            data: limitedData,
            error: null
          }).then(callback);
        }
      };
    },
    then: (callback: (value: SupabaseResponse<any[]>) => any) => {
      const data = mockStorage[table] || [];
      return Promise.resolve({
        data: data,
        error: null
      }).then(callback);
    }
  };
}

// Helper for insert operations
export function createInsertOperation(table: string, records: any) {
  console.log(`Mock client: ${table}.insert()`, records);
  
  // Convert single record to array
  const recordsArray = Array.isArray(records) ? records : [records];
  
  // Initialize table if it doesn't exist
  if (!mockStorage[table]) {
    mockStorage[table] = [];
  }
  
  // Add ID if not provided
  recordsArray.forEach((record: any) => {
    if (!record.id) {
      // Find max ID and increment
      const maxId = mockStorage[table].reduce(
        (max: number, item: any) => (item.id && item.id > max ? item.id : max),
        0
      );
      record.id = maxId + 1;
    }
    
    // Add created_at or criado_em if they don't exist
    if (!record.created_at && !record.criado_em) {
      record.criado_em = new Date().toISOString();
    }
    
    mockStorage[table].push(record);
  });
  
  // Save to localStorage
  saveMockStorageToLocalStorage();
  
  return {
    then: (callback: (value: SupabaseResponse<null>) => any) => {
      return Promise.resolve({
        data: null,
        error: null
      }).then(callback);
    }
  };
}

// Helper for update operations
export function createUpdateOperation(table: string, updates: any) {
  console.log(`Mock client: ${table}.update()`, updates);
  
  return {
    eq: (column: string, value: any) => {
      console.log(`Mock client: ${table}.update().eq(${column}, ${value})`);
      
      if (!mockStorage[table]) {
        return {
          then: (callback: (value: ErrorResponse) => any) => {
            return Promise.resolve({
              data: null,
              error: { message: 'Table not found' }
            }).then(callback);
          }
        };
      }
      
      // Find and update records
      mockStorage[table] = mockStorage[table].map((record: any) => {
        if (record[column] === value) {
          return { ...record, ...updates };
        }
        return record;
      });
      
      // Save to localStorage
      saveMockStorageToLocalStorage();
      
      return {
        then: (callback: (value: SupabaseResponse<null>) => any) => {
          return Promise.resolve({
            data: null,
            error: null
          }).then(callback);
        }
      };
    }
  };
}

// Helper for delete operations
export function createDeleteOperation(table: string) {
  console.log(`Mock client: ${table}.delete()`);
  
  return {
    eq: (column: string, value: any) => {
      console.log(`Mock client: ${table}.delete().eq(${column}, ${value})`);
      
      if (!mockStorage[table]) {
        return {
          then: (callback: (value: ErrorResponse) => any) => {
            return Promise.resolve({
              data: null,
              error: { message: 'Table not found' }
            }).then(callback);
          }
        };
      }
      
      // Filter out deleted records
      mockStorage[table] = mockStorage[table].filter(
        (record: any) => record[column] !== value
      );
      
      // Save to localStorage
      saveMockStorageToLocalStorage();
      
      return {
        then: (callback: (value: SupabaseResponse<null>) => any) => {
          return Promise.resolve({
            data: null,
            error: null
          }).then(callback);
        }
      };
    }
  };
}
