
// Export all service functions from a single file for easier imports
export { fetchCheckoutConfig } from './fetchConfigService';
export { saveConfig } from './saveConfigService';
export { 
  fetchTestimonials,
  deleteTestimonial,
  addTestimonial,
  updateTestimonial
} from './testimonialService';
export * from './checkoutConfigService';
