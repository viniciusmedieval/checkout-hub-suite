
import { createClient } from '@supabase/supabase-js';
import { mockStorage } from './storage-utils';
import { SimplifiedDatabase } from './types';
import { 
  createSelectOperation, 
  createInsertOperation, 
  createUpdateOperation,
  createDeleteOperation 
} from './operations';
import { mockAuthService, mockStorageService } from './services';

// Create a mock Supabase client for local development and testing
export function createMockClient() {
  console.warn('Using mock Supabase client');
  
  // Simple mock implementation of the Supabase client
  return {
    from: (table: string) => {
      console.log(`Mock client: from(${table})`);
      return {
        select: (columns: string = '*') => {
          console.log(`Mock client: ${table}.select(${columns})`);
          return createSelectOperation(table);
        },
        insert: (records: any) => {
          return createInsertOperation(table, records);
        },
        update: (updates: any) => {
          return createUpdateOperation(table, updates);
        },
        delete: () => {
          return createDeleteOperation(table);
        }
      };
    },
    auth: mockAuthService,
    storage: mockStorageService
  } as unknown as ReturnType<typeof createClient<SimplifiedDatabase>>;
}
