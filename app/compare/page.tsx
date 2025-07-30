"use client"

import { useState, useEffect } from "react"
import { ComparisonFilters } from "@/components/comparison/comparison-filters"
import { ComparisonTable } from "@/components/comparison/comparison-table"
import { ProductSelector } from "@/components/comparison/product-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { 
  Filter, 
  Share2, 
  Download, 
  Bookmark, 
  ArrowLeft, 
  Grid3X3, 
  Sparkles,
  Settings2
} from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { Product } from "@/lib/types/comparison"

const categories = [
  { id: "all", name: "Toutes les catégories", count: 0 },
  { id: "CPU", name: "Processeurs", count: 0 },
  { id: "GPU", name: "Cartes Graphiques", count: 0 },
  { id: "RAM", name: "Mémoire", count: 0 },
  { id: "SSD", name: "Stockage", count: 0 },
  { id: "Motherboard", name: "Cartes mères", count: 0 },
  { id: "PSU", name: "Alimentations", count: 0 },
  { id: "Case", name: "Boîtiers", count: 0 },
]

const brands = [
  { id: "Intel", name: "Intel", count: 0 },
  { id: "AMD", name: "AMD", count: 0 },
  { id: "NVIDIA", name: "NVIDIA", count: 0 },
  { id: "Corsair", name: "Corsair", count: 0 },
  { id: "Samsung", name: "Samsung", count: 0 },
]

interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  rating: number
  sortBy: string
  sortOrder: "asc" | "desc"
}

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    brands: [],
    priceRange: [0, 5000],
    rating: 0,
    sortBy: "name",
    sortOrder: "asc",
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les produits avec filtres
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        
        // Construire les paramètres de requête
        const params = new URLSearchParams()
        
        if (filters.search) {
          params.append('search', filters.search)
        }
        
        if (filters.categories.length > 0 && !filters.categories.includes('all')) {
          params.append('category', filters.categories[0])
        }
        
        if (filters.brands.length > 0) {
          params.append('brand', filters.brands[0])
        }
        
        if (filters.priceRange[0] > 0) {
          params.append('minPrice', filters.priceRange[0].toString())
        }
        
        if (filters.priceRange[1] < 5000) {
          params.append('maxPrice', filters.priceRange[1].toString())
        }
        
        const url = `/api/compare/products${params.toString() ? '?' + params.toString() : ''}`
        const data = await apiClient.get<Product[]>(url)
        setProducts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [filters])

  // Load saved comparison from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("comparison-products")
    if (saved) {
      try {
        const savedProducts = JSON.parse(saved)
        setSelectedProducts(savedProducts)
      } catch (error) {
        console.error("Error loading saved comparison:", error)
      }
    }
  }, [])

  // Save comparison to localStorage
  useEffect(() => {
    if (selectedProducts.length > 0) {
      localStorage.setItem("comparison-products", JSON.stringify(selectedProducts))
    }
  }, [selectedProducts])

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, { ...product, notes: "" }])
      toast.success(`${product.name} ajouté à la comparaison`)
    } else {
      toast.error("Vous ne pouvez comparer que 4 produits maximum")
    }
  }

  const removeProduct = (productId: number) => {
    const product = selectedProducts.find((p) => p.id === productId)
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
    if (product) {
      toast.success(`${product.name} retiré de la comparaison`)
    }
  }

  const updateNotes = (productId: number, notes: string) => {
    setSelectedProducts(selectedProducts.map((p) => (p.id === productId ? { ...p, notes } : p)))
  }

  const clearAllProducts = () => {
    setSelectedProducts([])
    localStorage.removeItem("comparison-products")
    toast.success("Comparaison vidée")
  }

  const saveComparison = () => {
    const comparisonData = {
      products: selectedProducts,
      timestamp: new Date().toISOString(),
      filters,
    }

    // Save to localStorage with timestamp
    const savedComparisons = JSON.parse(localStorage.getItem("saved-comparisons") || "[]")
    savedComparisons.push(comparisonData)
    localStorage.setItem("saved-comparisons", JSON.stringify(savedComparisons))

    toast.success("Comparaison sauvegardée avec succès!")
  }

  const shareComparison = async () => {
    const shareData = {
      title: "Comparaison de composants PC - Ultimate Setup",
      text: `Comparaison de ${selectedProducts.length} composants: ${selectedProducts.map((p) => p.name).join(", ")}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success("Comparaison partagée!")
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast.success("Lien copié dans le presse-papiers!")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Lien copié dans le presse-papiers!")
    }
  }

  const exportComparison = () => {
    const exportData = {
      products: selectedProducts,
      timestamp: new Date().toISOString(),
      comparison: "Ultimate Setup PC Components",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `comparison-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Comparaison exportée!")
  }

  // Appliquer le tri aux produits
  const sortedProducts = [...products].sort((a, b) => {
    const order = filters.sortOrder === "asc" ? 1 : -1

    switch (filters.sortBy) {
      case "price":
        return (a.price - b.price) * order
      case "rating":
        return (a.rating - b.rating) * order
      case "name":
        return a.name.localeCompare(b.name) * order
      case "performance":
        return ((a.performanceScore || 0) - (b.performanceScore || 0)) * order
      case "value":
        return ((a.valueScore || 0) - (b.valueScore || 0)) * order
      default:
        return 0
    }
  })

  const activeFiltersCount = 
    (filters.search ? 1 : 0) +
    (filters.categories.length > 0 && !filters.categories.includes('all') ? 1 : 0) +
    (filters.brands.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header moderne */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/catalog">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  Comparateur Intelligent
                </h1>
                <p className="text-sm text-gray-600">
                  Analysez et comparez jusqu'à 4 composants
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Badge de sélection */}
              <Badge 
                variant={selectedProducts.length > 0 ? "default" : "secondary"} 
                className="px-3 py-1 text-sm"
              >
                <Bookmark className="h-3 w-3 mr-1" />
                {selectedProducts.length}/4 sélectionnés
              </Badge>

              {/* Actions de comparaison */}
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportComparison}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareComparison}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                  <Button variant="destructive" size="sm" onClick={clearAllProducts}>
                    Vider
                  </Button>
                </div>
              )}

              {/* Bouton de filtres avec badge */}
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5" />
                      Filtres de comparaison
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ComparisonFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      categories={categories}
                      brands={brands}
                      productsCount={products.length}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">Produits disponibles</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{selectedProducts.length}</div>
              <div className="text-sm text-gray-600">En comparaison</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Catégories</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{activeFiltersCount}</div>
              <div className="text-sm text-gray-600">Filtres actifs</div>
            </CardContent>
          </Card>
        </div>

        {/* Table de comparaison */}
        {selectedProducts.length > 0 && (
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-blue-600" />
                  Comparaison détaillée
                </h2>
                <Button onClick={saveComparison} className="bg-blue-600 hover:bg-blue-700">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
              
              <ComparisonTable
                products={selectedProducts}
                onRemoveProduct={removeProduct}
                onUpdateNotes={updateNotes}
                onSaveComparison={saveComparison}
                onShareComparison={shareComparison}
              />
            </CardContent>
          </Card>
        )}

        {/* Sélecteur de produits */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Catalogue des composants
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {loading && <span>Chargement...</span>}
                {!loading && (
                  <span>{sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>

            {error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">Erreur de chargement</div>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : (
              <ProductSelector
                products={sortedProducts}
                selectedProducts={selectedProducts}
                onAddProduct={addProduct}
                maxProducts={4}
              />
            )}
          </CardContent>
        </Card>

        {/* Section d'aide */}
        {selectedProducts.length === 0 && !loading && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Commencez votre comparaison
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Sélectionnez des composants dans le catalogue ci-dessus pour commencer à les comparer. 
                  Vous pouvez choisir jusqu'à 4 produits et analyser leurs spécifications, performances et prix.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Sélectionnez</h4>
                    <p className="text-sm text-gray-600">Choisissez 2-4 composants à comparer</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Analysez</h4>
                    <p className="text-sm text-gray-600">Comparez les specs et performances</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Décidez</h4>
                    <p className="text-sm text-gray-600">Prenez la meilleure décision</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
