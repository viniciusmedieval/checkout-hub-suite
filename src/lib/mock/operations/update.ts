
import { mockStorage, saveMockStorageToLocalStorage } from '../storage-utils';
import { SupabaseResponse, ErrorResponse } from '../types';

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
