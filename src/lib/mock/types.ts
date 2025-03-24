
// Type definitions for the mock client

// Simplified database type to match what we need for the mock client
export type SimplifiedDatabase = {
  public: {
    Tables: Record<string, any>;
  }
}

// Common response types
export type SupabaseResponse<T> = {
  data: T;
  error: null | any;
}

export type SupabaseSingleResponse<T> = {
  data: T | null;
  error: null | any;
}

export type ErrorResponse = {
  data: null;
  error: { message: string };
}
