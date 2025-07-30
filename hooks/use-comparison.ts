import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, FilterState } from '@/lib/types/comparison'

interface ComparisonStore {
  // État de comparaison
  selectedProducts: Product[]
  maxProducts: number
  
  // Actions pour la comparaison
  addProduct: (product: Product) => void
  removeProduct: (productId: number) => void
  clearComparison: () => void
  isProductSelected: (productId: number) => boolean
  canAddMore: () => boolean
  
  // État des filtres
  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
  
  // État UI
  isLoading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

const defaultFilters: FilterState = {
  search: '',
  categories: [],
  brands: [],
  priceRange: [0, 5000],
  rating: 0
}

export const useComparison = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      // État initial
      selectedProducts: [],
      maxProducts: 4,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      // Actions pour la comparaison
      addProduct: (product: Product) => {
        const { selectedProducts, maxProducts } = get()
        
        if (selectedProducts.length >= maxProducts) {
          set({ error: `Vous ne pouvez comparer que ${maxProducts} produits maximum` })
          return
        }
        
        if (selectedProducts.find(p => p.id === product.id)) {
          set({ error: 'Ce produit est déjà dans la comparaison' })
          return
        }
        
        set({ 
          selectedProducts: [...selectedProducts, product],
          error: null
        })
      },

      removeProduct: (productId: number) => {
        const { selectedProducts } = get()
        set({ 
          selectedProducts: selectedProducts.filter(p => p.id !== productId),
          error: null
        })
      },

      clearComparison: () => {
        set({ 
          selectedProducts: [],
          error: null
        })
      },

      isProductSelected: (productId: number) => {
        const { selectedProducts } = get()
        return selectedProducts.some(p => p.id === productId)
      },

      canAddMore: () => {
        const { selectedProducts, maxProducts } = get()
        return selectedProducts.length < maxProducts
      },

      // Actions pour les filtres
      setFilters: (newFilters: Partial<FilterState>) => {
        const { filters } = get()
        set({ 
          filters: { ...filters, ...newFilters },
          error: null
        })
      },

      resetFilters: () => {
        set({ 
          filters: defaultFilters,
          error: null
        })
      },

      // Actions UI
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'comparison-storage',
      partialize: (state) => ({ 
        selectedProducts: state.selectedProducts,
        filters: state.filters
      })
    }
  )
)

// Hook pour charger les produits avec filtres
export const useProducts = () => {
  const { filters, setLoading, setError } = useComparison()
  
  const loadProducts = async (): Promise<Product[]> => {
    try {
      setLoading(true)
      setError(null)
      
      // Construire les paramètres de requête
      const params = new URLSearchParams()
      
      if (filters.search) {
        params.append('search', filters.search)
      }
      
      if (filters.categories.length > 0 && !filters.categories.includes('all')) {
        params.append('category', filters.categories[0]) // Une seule catégorie pour simplifier
      }
      
      if (filters.brands.length > 0) {
        params.append('brand', filters.brands[0]) // Une seule marque pour simplifier
      }
      
      if (filters.priceRange[0] > 0) {
        params.append('minPrice', filters.priceRange[0].toString())
      }
      
      if (filters.priceRange[1] < 5000) {
        params.append('maxPrice', filters.priceRange[1].toString())
      }
      
      const response = await fetch(`/api/compare/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits')
      }
      
      const products = await response.json()
      setLoading(false)
      return products
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
      setLoading(false)
      return []
    }
  }
  
  return { loadProducts }
}
