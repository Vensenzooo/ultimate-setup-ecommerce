"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, Search, Filter, Grid, List, Eye, Heart, ShoppingCart, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Intel Core i9-14900K",
    category: "CPU",
    brand: "Intel",
    price: 589.99,
    originalPrice: 649.99,
    rating: 4.8,
    reviews: 234,
    stock: 15,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: 24,
      threads: 32,
      baseClock: "3.2 GHz",
      boostClock: "6.0 GHz",
      socket: "LGA1700",
      tdp: "125W",
    },
    description:
      "Processeur Intel Core i9 de 14ème génération offrant des performances exceptionnelles pour le gaming et la création de contenu.",
    features: ["Architecture Raptor Lake", "Support DDR5", "PCIe 5.0", "Intel UHD Graphics 770"],
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X",
    category: "CPU",
    brand: "AMD",
    price: 549.99,
    rating: 4.7,
    reviews: 189,
    stock: 8,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: 16,
      threads: 32,
      baseClock: "4.5 GHz",
      boostClock: "5.7 GHz",
      socket: "AM5",
      tdp: "170W",
    },
    description:
      "Processeur AMD Ryzen 9 avec architecture Zen 4, parfait pour les workstations et le gaming haute performance.",
    features: ["Architecture Zen 4", "Support DDR5", "PCIe 5.0", "AMD Radeon Graphics"],
  },
  {
    id: 3,
    name: "NVIDIA RTX 4080 Super",
    category: "GPU",
    brand: "NVIDIA",
    price: 999.99,
    rating: 4.9,
    reviews: 156,
    stock: 12,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      memory: "16GB GDDR6X",
      baseClock: "2295 MHz",
      boostClock: "2550 MHz",
      memoryBus: "256-bit",
      power: "320W",
    },
    description: "Carte graphique NVIDIA RTX 4080 Super pour gaming 4K et ray tracing en temps réel.",
    features: ["Ray Tracing", "DLSS 3", "AV1 Encoding", "Ada Lovelace Architecture"],
  },
  {
    id: 4,
    name: "Corsair Vengeance DDR5-6000",
    category: "RAM",
    brand: "Corsair",
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 89,
    stock: 25,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      capacity: "32GB (2x16GB)",
      speed: "6000 MHz",
      latency: "CL30",
      voltage: "1.35V",
      type: "DDR5",
    },
    description:
      "Kit mémoire DDR5 haute performance optimisé pour les processeurs Intel et AMD de dernière génération.",
    features: ["Profils XMP 3.0", "Dissipateurs thermiques", "RGB personnalisable", "Garantie à vie"],
  },
]

const categories = ["Tous", "CPU", "GPU", "RAM", "SSD", "Carte Mère", "Alimentation", "Boîtier"]
const brands = ["Tous", "Intel", "AMD", "NVIDIA", "Corsair", "G.Skill", "Samsung", "Western Digital"]

export default function GuestCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "name":
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
  }, [searchTerm, selectedCategory, selectedBrands, priceRange, sortBy])

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ultimate Setup
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/guest/catalog" className="text-primary font-medium">
                Catalogue
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary">
                À propos
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/auth">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Guest Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-700">
                <strong>Mode Invité:</strong> Créez un compte pour sauvegarder vos configurations et passer commande
              </p>
            </div>
            <Link href="/auth">
              <Button size="sm">Créer un compte</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Filtres</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Marques</Label>
                <div className="space-y-2">
                  {brands.slice(1).map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                      />
                      <Label htmlFor={brand} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Prix: {priceRange[0]}€ - {priceRange[1]}€
                </Label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={1500} step={50} className="mt-2" />
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSelectedCategory("Tous")
                  setSelectedBrands([])
                  setPriceRange([0, 1500])
                  setSearchTerm("")
                }}
              >
                Réinitialiser
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Mis en avant</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-muted-foreground mb-6">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </p>

            {/* Products Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}>
                    <div className={viewMode === "grid" ? "" : "w-32 flex-shrink-0"}>
                      <div className="relative mb-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className={`object-cover rounded-lg ${viewMode === "grid" ? "w-full h-48" : "w-32 h-32"}`}
                        />
                        {product.originalPrice && (
                          <Badge className="absolute top-2 right-2" variant="destructive">
                            Promo
                          </Badge>
                        )}
                        {product.stock < 10 && (
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            Stock faible
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>

                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{product.price}€</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">{product.originalPrice}€</span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">Stock: {product.stock} unités</p>

                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedProduct?.name}</DialogTitle>
                              <DialogDescription>Détails complets du produit</DialogDescription>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-6">
                                <div className="flex gap-6">
                                  <Image
                                    src={selectedProduct.image || "/placeholder.svg"}
                                    alt={selectedProduct.name}
                                    width={200}
                                    height={200}
                                    className="rounded-lg object-cover"
                                  />
                                  <div className="flex-1 space-y-4">
                                    <div>
                                      <Badge variant="outline">{selectedProduct.category}</Badge>
                                      <h3 className="text-xl font-bold mt-2">{selectedProduct.name}</h3>
                                      <p className="text-gray-600">{selectedProduct.brand}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < Math.floor(selectedProduct.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        ({selectedProduct.reviews} avis)
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-2xl font-bold text-primary">{selectedProduct.price}€</span>
                                      {selectedProduct.originalPrice && (
                                        <span className="text-lg text-muted-foreground line-through">
                                          {selectedProduct.originalPrice}€
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Description</h4>
                                  <p className="text-gray-600">{selectedProduct.description}</p>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Spécifications</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(selectedProduct.specs).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-gray-600 capitalize">
                                          {key.replace(/([A-Z])/g, " $1")}:
                                        </span>
                                        <span className="font-medium">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Caractéristiques</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedProduct.features.map((feature: string, index: number) => (
                                      <Badge key={index} variant="secondary">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Link href="/auth" className="flex-1">
                                    <Button className="w-full">
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      Se connecter pour commander
                                    </Button>
                                  </Link>
                                  <Button variant="outline">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" disabled>
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSelectedCategory("Tous")
                    setSelectedBrands([])
                    setPriceRange([0, 1500])
                    setSearchTerm("")
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
