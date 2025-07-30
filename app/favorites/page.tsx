"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, Search, ShoppingCart, Trash2, SortAsc, SortDesc, Filter, Star } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')
  
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

  // Filtrer et trier les favoris
  const filteredAndSortedFavorites = favorites
    .filter(favorite => {
      const matchesSearch = favorite.productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || favorite.productCategory?.toLowerCase() === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.productName.localeCompare(b.productName)
        case 'price-low':
          return a.productPrice - b.productPrice
        case 'price-high':
          return b.productPrice - a.productPrice
        case 'oldest':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        default: // newest
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  const totalValue = favorites.reduce((sum, favorite) => sum + favorite.productPrice, 0)
  const categories = [...new Set(favorites.map(f => f.productCategory).filter(Boolean))]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">Mes Favoris</h1>
            <p className="text-muted-foreground">
              {favoritesCount} produit{favoritesCount > 1 ? 's' : ''} • Valeur totale: {totalValue.toFixed(2)}€
            </p>
          </div>
        </div>

        {favoritesCount > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher dans mes favoris..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>

              {/* Filtre par catégorie */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category?.toLowerCase() || ''}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  favorites.forEach(favorite => handleAddToCart(favorite))
                  toast({
                    title: "Tous les favoris ajoutés",
                    description: "Tous vos favoris ont été ajoutés au panier",
                  })
                }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Tout ajouter au panier
              </Button>
              <Button
                variant="outline"
                onClick={clearFavorites}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      {favoritesCount === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-4">Aucun favori pour le moment</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Parcourez notre catalogue et ajoutez vos produits préférés en cliquant sur l'icône cœur
          </p>
          <Button asChild>
            <Link href="/catalog">
              Découvrir nos produits
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {filteredAndSortedFavorites.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou de filtrage
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedFavorites.map((favorite) => (
                <Card key={favorite.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={favorite.productImage || '/placeholder.jpg'}
                          alt={favorite.productName}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite.productId, favorite.productName)}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 rounded-full p-2"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                      {favorite.productCategory && (
                        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-700">
                          {favorite.productCategory}
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-2 mb-2">
                        {favorite.productName}
                      </h3>
                      {favorite.productDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {favorite.productDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-blue-600">
                          {favorite.productPrice.toFixed(2)}€
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Ajouté le {new Date(favorite.addedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(favorite)}
                        className="w-full"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ajouter au panier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
