
// Auth and storage service mocks

// Mock auth service
export const mockAuthService = {
  signUp: () => Promise.resolve({ data: null, error: null }),
  signIn: () => Promise.resolve({ data: null, error: null }),
  signOut: () => Promise.resolve({ error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
};

// Mock storage service
export const mockStorageService = {
  from: () => ({
    upload: () => Promise.resolve({ data: null, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: 'mock-public-url' } })
  })
};
