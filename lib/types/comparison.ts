// Types pour la fonctionnalité de comparaison de produits

export interface Product {
  id: number
  name: string
  category: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  stock: number
  image: string
  specs: Record<string, string | number>
  description: string
  features: string[]
  pros: string[]
  cons: string[]
  performanceScore: number
  valueScore: number
  isPopular?: boolean
  isNew?: boolean
  isBestSeller?: boolean
  notes?: string
}

export interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  rating: number
}

export interface ComparisonState {
  selectedProducts: Product[]
  maxProducts: number
}

export const COMPARISON_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '📦' },
  { id: 'CPU', name: 'Processeurs', icon: '🔧' },
  { id: 'GPU', name: 'Cartes graphiques', icon: '🎮' },
  { id: 'RAM', name: 'Mémoire', icon: '💾' },
  { id: 'SSD', name: 'Stockage', icon: '💿' },
  { id: 'Motherboard', name: 'Cartes mères', icon: '🔌' },
  { id: 'PSU', name: 'Alimentations', icon: '⚡' },
  { id: 'Case', name: 'Boîtiers', icon: '📱' }
] as const

export type ComparisonCategory = typeof COMPARISON_CATEGORIES[number]['id']

export const PRICE_RANGES = [
  { min: 0, max: 100, label: 'Moins de 100€' },
  { min: 100, max: 250, label: '100€ - 250€' },
  { min: 250, max: 500, label: '250€ - 500€' },
  { min: 500, max: 1000, label: '500€ - 1000€' },
  { min: 1000, max: 2000, label: '1000€ - 2000€' },
  { min: 2000, max: Infinity, label: 'Plus de 2000€' }
] as const

export const SORT_OPTIONS = [
  { value: 'name', label: 'Nom A-Z' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'popular', label: 'Populaires' },
  { value: 'performance', label: 'Performance' },
  { value: 'value', label: 'Rapport qualité/prix' }
] as const

export type SortOption = typeof SORT_OPTIONS[number]['value']
