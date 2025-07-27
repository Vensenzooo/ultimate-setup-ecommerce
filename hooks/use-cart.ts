"use client"


import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cartApi } from "@/lib/api/cart"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
  specifications?: Record<string, any>;
}

// PLAN MIGRATION PANIER VERS BACKEND
// 1. Remplacer la gestion locale (Zustand/localStorage) par des appels API
// 2. Créer les endpoints backend :
//    - POST /cart/add
//    - DELETE /cart/remove/:id
//    - PUT /cart/update/:id
//    - POST /cart/clear
//    - GET /cart (pour récupérer le panier)
// 3. Refactorer chaque méthode pour utiliser l'API (voir exemples ci-dessous)
// 4. Ajouter gestion loading/error pour chaque action
// 5. Supprimer la persistance locale une fois la connexion API opérationnelle

export interface CartStore {
  items: CartItem[]
  loading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  addConfiguration: (config: Record<string, any>) => Promise<void>
}


// TODO: Migrer la logique du panier vers le backend
// - Remplacer la gestion locale (Zustand/localStorage) par des appels API
// - Utiliser des états de chargement et d'erreur pour chaque action
// - Exemple d'intégration API (à implémenter dans la prochaine étape) :
// import { apiClient } from "@/lib/api/client"
// await apiClient.post("cart/add", { ...item })
// await apiClient.delete(`cart/remove/${id}`)
// await apiClient.put(`cart/update/${id}`, { quantity })
// await apiClient.post("cart/clear")


export const useCart = create<CartStore>()(
  (set, get) => ({
    items: [],
    loading: false,
    error: null,

    fetchCart: async () => {
      set({ loading: true, error: null })
      try {
        const items = await cartApi.getCart()
        set({ items, loading: false })
      } catch (error: any) {
        set({ error: error.message || "Erreur chargement panier", loading: false })
      }
    },

    addItem: async (item) => {
      set({ loading: true, error: null })
      try {
        const items = await cartApi.addItem(item)
        set({ items, loading: false })
      } catch (error: any) {
        set({ error: error.message || "Erreur ajout panier", loading: false })
      }
    },

    removeItem: async (id) => {
      set({ loading: true, error: null })
      try {
        const items = await cartApi.removeItem(id)
        set({ items, loading: false })
      } catch (error: any) {
        set({ error: error.message || "Erreur suppression panier", loading: false })
      }
    },

    updateQuantity: async (id, quantity) => {
      set({ loading: true, error: null })
      try {
        const items = await cartApi.updateQuantity(id, quantity)
        set({ items, loading: false })
      } catch (error: any) {
        set({ error: error.message || "Erreur maj quantité", loading: false })
      }
    },

    clearCart: async () => {
      set({ loading: true, error: null })
      try {
        const items = await cartApi.clearCart()
        set({ items, loading: false })
      } catch (error: any) {
        set({ error: error.message || "Erreur vidage panier", loading: false })
      }
    },

    getTotalItems: () => {
      return get().items.reduce((total, item) => total + item.quantity, 0)
    },

    getTotalPrice: () => {
      return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    addConfiguration: async (config) => {
      set({ loading: true, error: null })
      try {
        const configItems: Omit<CartItem, "quantity">[] = []
        Object.entries(config).forEach(([category, component]: [string, any]) => {
          if (component) {
            configItems.push({
              id: component.id,
              name: component.name,
              price: component.price,
              image: component.image,
              category,
              specifications: component.specifications,
            })
          }
        })
        let items = get().items
        for (const item of configItems) {
          items = await cartApi.addItem(item)
        }
        set({ items, loading: false })
      } catch (error: any) {
        set({ error: error.message || "Erreur config panier", loading: false })
      }
    },
  })
)
