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
import { Star, Search, Filter, Grid, List } from "lucide-react"
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
    specs: { cores: 24, threads: 32, baseClock: "3.2 GHz", boostClock: "6.0 GHz" },
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
    specs: { cores: 16, threads: 32, baseClock: "4.5 GHz", boostClock: "5.7 GHz" },
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
    specs: { memory: "16GB GDDR6X", baseClock: "2295 MHz", boostClock: "2550 MHz" },
  },
  {
    id: 4,
    name: "AMD Radeon RX 7800 XT",
    category: "GPU",
    brand: "AMD",
    price: 749.99,
    originalPrice: 799.99,
    rating: 4.6,
    reviews: 98,
    stock: 6,
    image: "/placeholder.svg?height=200&width=200",
    specs: { memory: "16GB GDDR6", baseClock: "2124 MHz", boostClock: "2430 MHz" },
  },
  {
    id: 5,
    name: "Corsair Vengeance DDR5-6000",
    category: "RAM",
    brand: "Corsair",
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 89,
    stock: 25,
    image: "/placeholder.svg?height=200&width=200",
    specs: { capacity: "32GB (2x16GB)", speed: "6000 MHz", latency: "CL30" },
  },
  {
    id: 6,
    name: "G.Skill Trident Z5 DDR5-7200",
    category: "RAM",
    brand: "G.Skill",
    price: 299.99,
    rating: 4.8,
    reviews: 67,
    stock: 18,
    image: "/placeholder.svg?height=200&width=200",
    specs: { capacity: "32GB (2x16GB)", speed: "7200 MHz", latency: "CL34" },
  },
  {
    id: 7,
    name: "Samsung 980 PRO 2TB",
    category: "SSD",
    brand: "Samsung",
    price: 159.99,
    rating: 4.6,
    reviews: 312,
    stock: 30,
    image: "/placeholder.svg?height=200&width=200",
    specs: { capacity: "2TB", interface: "PCIe 4.0", read: "7000 MB/s", write: "6900 MB/s" },
  },
  {
    id: 8,
    name: "WD Black SN850X 1TB",
    category: "SSD",
    brand: "Western Digital",
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.5,
    reviews: 245,
    stock: 22,
    image: "/placeholder.svg?height=200&width=200",
    specs: { capacity: "1TB", interface: "PCIe 4.0", read: "7300 MB/s", write: "6600 MB/s" },
  },
]

const categories = ["Tous", "CPU", "GPU", "RAM", "SSD", "Carte Mère", "Alimentation", "Boîtier"]
const brands = ["Tous", "Intel", "AMD", "NVIDIA", "Corsair", "G.Skill", "Samsung", "Western Digital"]

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ultimate Setup
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/catalog" className="text-primary font-medium">
                Catalogue
              </Link>
              <Link href="/configurator" className="text-muted-foreground hover:text-primary">
                Configurateur
              </Link>
              <Link href="/compare" className="text-muted-foreground hover:text-primary">
                Comparateur
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="outline">Connexion</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="p-6">
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
                        <Button className="flex-1" size="sm">
                          Ajouter au panier
                        </Button>
                        <Button variant="outline" size="sm">
                          Comparer
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
