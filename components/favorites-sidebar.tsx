"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Heart, Trash2, ShoppingCart, X } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export function FavoritesSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { favorites, isLoading, removeFromFavorites, clearFavorites, favoritesCount } = useFavorites()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async (favorite: any) => {
    try {
      await addItem({
        id: favorite.productId,
        name: favorite.productName,
        price: favorite.productPrice,
        imageUrl: favorite.productImage,
        quantity: 1,
      })
      toast({
        title: "Ajouté au panier",
        description: `${favorite.productName} a été ajouté au panier`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFavorite = async (productId: string, productName: string) => {
    await removeFromFavorites(productId)
  }

  const totalValue = favorites.reduce((sum, favorite) => sum + favorite.productPrice, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Heart className="h-5 w-5" />
          {favoritesCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {favoritesCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Mes Favoris ({favoritesCount})
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucun favori</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez des produits à vos favoris pour les retrouver facilement
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  Valeur totale: <span className="font-medium text-foreground">{totalValue.toFixed(2)}€</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFavorites}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Tout supprimer
                </Button>
              </div>
              <Separator className="mb-4" />
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={favorite.productImage || '/placeholder.jpg'}
                        alt={favorite.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {favorite.productName}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {favorite.productPrice.toFixed(2)}€
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(favorite)}
                          className="flex-1"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFavorite(favorite.productId, favorite.productName)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {favorites.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    favorites.forEach(favorite => handleAddToCart(favorite))
                    toast({
                      title: "Tous les favoris ajoutés",
                      description: "Tous vos favoris ont été ajoutés au panier",
                    })
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tout ajouter au panier
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
