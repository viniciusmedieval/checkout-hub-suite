
import { mockStorage } from '../storage-utils';
import { SupabaseResponse, SupabaseSingleResponse } from '../types';

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
