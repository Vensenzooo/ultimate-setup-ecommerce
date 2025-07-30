// Compatibility layer - exports the backend cart hook as default
// This ensures existing imports continue to work
export { useCart as default, useCart } from './use-cart-backend'