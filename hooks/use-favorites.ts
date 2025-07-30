"use client"

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'

export interface FavoriteItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  productDescription?: string
  productCategory?: string
  addedAt: Date
}

export function useFavorites() {
  const { isSignedIn, user } = useUser()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Charger les favoris depuis l'API
  const loadFavorites = useCallback(async () => {
    if (!isSignedIn) {
      // Pour les utilisateurs non connectés, charger depuis localStorage
      const savedFavorites = localStorage.getItem('guestFavorites')
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn])

  // Ajouter aux favoris
  const addToFavorites = useCallback(async (product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }) => {
    const favoriteItem: FavoriteItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.imageUrl,
      addedAt: new Date()
    }

    if (!isSignedIn) {
      // Sauvegarder en localStorage pour les invités
      const currentFavorites = [...favorites, favoriteItem]
      setFavorites(currentFavorites)
      localStorage.setItem('guestFavorites', JSON.stringify(currentFavorites))
      
      toast({
        title: "Ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris`,
      })
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl,
        }),
      })

      if (response.ok) {
        const newFavorite = await response.json()
        setFavorites(prev => [...prev, newFavorite])
        
        toast({
          title: "Ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris`,
        })
      } else {
        throw new Error('Erreur lors de l\'ajout aux favoris')
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive",
      })
    }
  }, [favorites, isSignedIn, toast])

  // Retirer des favoris
  const removeFromFavorites = useCallback(async (productId: string) => {
    if (!isSignedIn) {
      // Retirer du localStorage pour les invités
      const currentFavorites = favorites.filter(item => item.productId !== productId)
      setFavorites(currentFavorites)
      localStorage.setItem('guestFavorites', JSON.stringify(currentFavorites))
      
      toast({
        title: "Retiré des favoris",
        description: "Produit retiré de vos favoris",
      })
      return
    }

    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(item => item.productId !== productId))
        
        toast({
          title: "Retiré des favoris",
          description: "Produit retiré de vos favoris",
        })
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive",
      })
    }
  }, [favorites, isSignedIn, toast])

  // Vérifier si un produit est en favoris
  const isFavorite = useCallback((productId: string) => {
    return favorites.some(item => item.productId === productId)
  }, [favorites])

  // Vider tous les favoris
  const clearFavorites = useCallback(async () => {
    if (!isSignedIn) {
      setFavorites([])
      localStorage.removeItem('guestFavorites')
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
      })

      if (response.ok) {
        setFavorites([])
        toast({
          title: "Favoris supprimés",
          description: "Tous vos favoris ont été supprimés",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les favoris",
        variant: "destructive",
      })
    }
  }, [isSignedIn, toast])

  // Charger les favoris au montage du composant
  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  }
}
