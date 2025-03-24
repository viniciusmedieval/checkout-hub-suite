
import { mockStorage, saveMockStorageToLocalStorage } from '../storage-utils';
import { SupabaseResponse } from '../types';

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
