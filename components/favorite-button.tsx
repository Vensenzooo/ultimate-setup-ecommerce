"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
  className?: string
  size?: 'default' | 'sm' | 'lg'
}

export function FavoriteButton({ product, className, size = 'default' }: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [isLoading, setIsLoading] = useState(false)
  
  const isProductFavorite = isFavorite(product.id)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      if (isProductFavorite) {
        await removeFromFavorites(product.id)
      } else {
        await addToFavorites(product)
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        isProductFavorite 
          ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100" 
          : "text-gray-400 hover:text-red-500 bg-white/80 hover:bg-red-50",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isProductFavorite && "fill-current"
        )} 
      />
    </Button>
  )
}
