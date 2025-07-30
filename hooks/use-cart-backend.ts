"use client"

import { create } from "zustand"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import React from "react"

export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    imageUrl?: string
    category: {
      name: string
    }
  }
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
}

export interface CartStore {
  cart: Cart | null
  loading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  addConfiguration: (components: Record<string, any>) => Promise<void>
}

export const useCartStore = create<CartStore>((set: any, get: any) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) {
        if (response.status === 401) {
          // Utilisateur non connecté - panier invité
          set({ cart: { id: null, userId: null, items: [], isGuest: true }, loading: false })
          return
        }
        if (response.status === 404) {
          // Utilisateur connecté mais pas en base - need profile
          const errorData = await response.json()
          if (errorData.needsProfile) {
            set({ cart: null, loading: false, error: 'Veuillez compléter votre profil d\'abord.' })
            return
          }
        }
        const errorData = await response.text()
        console.error('Erreur API cart:', response.status, errorData)
        throw new Error(`Erreur ${response.status}: ${errorData}`)
      }
      const cart = await response.json()
      set({ cart, loading: false })
    } catch (error: any) {
      console.error('Erreur fetchCart:', error)
      // Ne pas afficher l'erreur à l'utilisateur si ce n'est qu'un problème de connexion
      if (error.message?.includes('fetch')) {
        set({ cart: null, loading: false, error: null })
      } else {
        set({ error: error.message, loading: false })
      }
    }
  },

  addItem: async (productId: number, quantity = 1) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion spéciale pour utilisateur non connecté
        if (response.status === 401 && errorData.needsAuth) {
          throw new Error('Connexion requise pour ajouter au panier')
        }
        
        // Gestion spéciale pour utilisateur non trouvé (profil incomplet)
        if (response.status === 404 && errorData.needsProfile) {
          throw new Error('Profil utilisateur requis')
        }
        
        throw new Error(errorData.error || 'Erreur lors de l\'ajout au panier')
      }

      const cart = await response.json()
      set({ cart, loading: false })
      toast.success('Produit ajouté au panier!')
    } catch (error: any) {
      console.error('Erreur addItem:', error)
      set({ error: error.message, loading: false })
      
      // Toast d'erreur plus spécifique avec boutons d'action
      if (error.message.includes('Connexion requise')) {
        toast.error('Connexion requise', {
          description: 'Connectez-vous pour ajouter des produits au panier',
          action: {
            label: "Se connecter",
            onClick: () => {
              window.location.href = '/auth'
            }
          }
        })
      } else if (error.message.includes('Profil utilisateur requis')) {
        toast.error('Profil incomplet', {
          description: 'Veuillez compléter votre profil pour utiliser le panier',
          action: {
            label: "Compléter profil",
            onClick: () => {
              window.location.href = '/auth'
            }
          }
        })
      } else {
        toast.error(error.message)
      }
    }
  },

  removeItem: async (itemId: number) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      const cart = await response.json()
      set({ cart, loading: false })
      toast.success('Produit retiré du panier')
    } catch (error: any) {
      console.error('Erreur removeItem:', error)
      set({ error: error.message, loading: false })
      toast.error(error.message)
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const cart = await response.json()
      set({ cart, loading: false })
    } catch (error: any) {
      console.error('Erreur updateQuantity:', error)
      set({ error: error.message, loading: false })
      toast.error(error.message)
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors du vidage du panier')
      }

      const cart = await response.json()
      set({ cart, loading: false })
      toast.success('Panier vidé')
    } catch (error: any) {
      console.error('Erreur clearCart:', error)
      set({ error: error.message, loading: false })
      toast.error(error.message)
    }
  },

  getTotalItems: () => {
    const cart = get().cart
    return cart?.items.reduce((total: number, item: CartItem) => total + item.quantity, 0) || 0
  },

  getTotalPrice: () => {
    const cart = get().cart
    return cart?.items.reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0) || 0
  },

  addConfiguration: async (components: Record<string, any>) => {
    set({ loading: true, error: null })
    try {
      // Pour l'instant, on ajoute chaque composant individuellement au panier
      // Dans une vraie app, on pourrait créer un endpoint spécial pour les configurations
      const componentList = Object.values(components)
      
      for (const component of componentList) {
        // Trouver le produit correspondant par nom (simulation)
        // Dans une vraie app, on aurait un mapping ID component -> ID produit
        const productResponse = await fetch('/api/products')
        if (productResponse.ok) {
          const products = await productResponse.json()
          const matchingProduct = products.find((p: any) => 
            p.name.toLowerCase().includes(component.name.toLowerCase().split(' ')[0])
          )
          
          if (matchingProduct) {
            // Ajouter le produit au panier
            await get().addItem(matchingProduct.id, 1)
          }
        }
      }
      
      toast.success(`Configuration ajoutée au panier ! (${componentList.length} composants)`)
    } catch (error: any) {
      console.error('Erreur addConfiguration:', error)
      set({ error: error.message, loading: false })
      
      // Gestion d'erreur plus gracieuse avec boutons d'action
      if (error.message.includes('Utilisateur non trouvé') || error.message.includes('Profil utilisateur requis')) {
        toast.error('Profil utilisateur requis', {
          description: 'Veuillez compléter votre profil pour ajouter des produits au panier. Cliquez pour vous connecter.',
          action: {
            label: "Se connecter",
            onClick: () => {
              // Rediriger vers la page d'authentification
              window.location.href = '/auth'
            }
          }
        })
      } else if (error.message.includes('Connexion requise')) {
        toast.error('Connexion requise', {
          description: 'Connectez-vous pour ajouter des produits au panier',
          action: {
            label: "Se connecter",
            onClick: () => {
              window.location.href = '/auth'
            }
          }
        })
      } else {
        toast.error(error.message)
      }
    }
  }
}))

// Hook React pour utiliser le panier
export function useCart() {
  const store = useCartStore()
  const { isSignedIn, isLoaded } = useUser()

  // Charger le panier automatiquement quand l'utilisateur se connecte
  React.useEffect(() => {
    // Attendre que Clerk soit chargé
    if (!isLoaded) return
    
    if (isSignedIn) {
      // Petit délai pour s'assurer que l'auth est complètement initialisée
      const timer = setTimeout(() => {
        store.fetchCart()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      // Reset le panier si l'utilisateur se déconnecte
      useCartStore.setState({ cart: null, error: null })
    }
  }, [isSignedIn, isLoaded])

  // Écouter l'événement de synchronisation utilisateur
  React.useEffect(() => {
    const handleUserSynced = () => {
      if (isSignedIn) {
        // Recharger le panier après synchronisation
        setTimeout(() => store.fetchCart(), 500)
      }
    }

    window.addEventListener('userSynced', handleUserSynced)
    return () => window.removeEventListener('userSynced', handleUserSynced)
  }, [isSignedIn])

  // Recharger le panier après une tentative d'ajout qui a échoué (utile après sync user)
  const retryFetchCart = React.useCallback(async () => {
    if (isSignedIn) {
      await store.fetchCart()
    }
  }, [isSignedIn])

  return {
    ...store,
    retryFetchCart
  }
}
