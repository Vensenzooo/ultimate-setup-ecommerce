"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Star, Zap, Award, TrendingUp } from "lucide-react"
import Image from "next/image"

interface Product {
  id: number
  name: string
  category: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  specs: Record<string, string | number>
  pros: string[]
  cons: string[]
  performanceScore?: number
  valueScore?: number
  isPopular?: boolean
  isNew?: boolean
  isBestSeller?: boolean
  notes?: string
}

interface ProductSelectorProps {
  products: Product[]
  selectedProducts: Product[]
  onAddProduct: (product: Product) => void
  maxProducts: number
}

export function ProductSelector({ products, selectedProducts, onAddProduct, maxProducts }: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const categories = [
    { id: "all", name: "Tous", count: products.length },
    { id: "CPU", name: "Processeurs", count: products.filter((p) => p.category === "CPU").length },
    { id: "GPU", name: "Cartes Graphiques", count: products.filter((p) => p.category === "GPU").length },
    { id: "RAM", name: "Mémoire", count: products.filter((p) => p.category === "RAM").length },
    { id: "SSD", name: "Stockage", count: products.filter((p) => p.category === "SSD").length },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const notSelected = !selectedProducts.find((p) => p.id === product.id)

    return matchesSearch && matchesCategory && notSelected
  })

  const handleAddProduct = (product: Product) => {
    onAddProduct(product)
    setIsDialogOpen(false)
    setSearchTerm("")
  }

  const getProductBadges = (product: Product) => {
    const badges = []
    if (product.isNew) badges.push({ text: "Nouveau", variant: "default" as const })
    if (product.isBestSeller) badges.push({ text: "Best Seller", variant: "secondary" as const })
    if (product.isPopular) badges.push({ text: "Populaire", variant: "outline" as const })
    if (product.originalPrice) badges.push({ text: "Promo", variant: "destructive" as const })
    return badges
  }

  return (
    <div className="space-y-6">
      {/* Quick Add Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Ajouter des produits</h2>
          <p className="text-gray-600">
            Sélectionnez jusqu'à {maxProducts} produits à comparer ({selectedProducts.length}/{maxProducts})
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedProducts.length >= maxProducts}>
              <Plus className="h-4 w-4 mr-2" />
              Parcourir tous les produits
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Sélectionner des produits</DialogTitle>
              <DialogDescription>Choisissez des produits à ajouter à votre comparaison</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-5">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      {category.name}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => handleAddProduct(product)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={120}
                            height={80}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <div className="absolute top-1 right-1 flex flex-wrap gap-1">
                            {getProductBadges(product)
                              .slice(0, 2)
                              .map((badge, index) => (
                                <Badge key={index} variant={badge.variant} className="text-xs px-1 py-0">
                                  {badge.text}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {product.category}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>

                          {product.performanceScore && (
                            <div className="flex items-center space-x-1">
                              <Zap className="h-3 w-3 text-blue-500" />
                              <span className="text-xs font-medium">{product.performanceScore}/10</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-primary">{product.price}€</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-500 line-through ml-1">{product.originalPrice}€</span>
                            )}
                          </div>

                          {product.valueScore && (
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3 text-green-500" />
                              <span className="text-xs font-medium text-green-600">{product.valueScore}/10</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun produit trouvé</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Featured/Popular Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products
          .filter((p) => !selectedProducts.find((sp) => sp.id === p.id))
          .filter((p) => p.isPopular || p.isBestSeller || p.isNew)
          .slice(0, 8)
          .map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={120}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                      {getProductBadges(product)
                        .slice(0, 1)
                        .map((badge, index) => (
                          <Badge key={index} variant={badge.variant} className="text-xs">
                            {badge.text}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {product.performanceScore && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-blue-500" />
                          <span className="text-xs font-medium">{product.performanceScore}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-primary">{product.price}€</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through ml-1">{product.originalPrice}€</span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddProduct(product)}
                    disabled={selectedProducts.length >= maxProducts}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Comparer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
