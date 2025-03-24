
import { mockStorage, saveMockStorageToLocalStorage } from '../storage-utils';
import { SupabaseResponse, ErrorResponse } from '../types';

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
