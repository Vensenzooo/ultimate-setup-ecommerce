"use client"

import { useState, useEffect } from "react"
import { ComparisonFilters } from "@/components/comparison/comparison-filters"
import { ComparisonTable } from "@/components/comparison/comparison-table"
import { ProductSelector } from "@/components/comparison/product-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Share2, Download, Bookmark } from "lucide-react"
import Link from "next/link"

// Enhanced product data with more detailed specs and scoring
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
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: "24 (8P + 16E)",
      threads: "32",
      baseClock: "3.2 GHz",
      boostClock: "6.0 GHz",
      socket: "LGA1700",
      tdp: "125W",
      cache: "36MB",
      architecture: "Raptor Lake",
      manufacturing: "Intel 7",
      integratedGraphics: "Intel UHD Graphics 770",
      memorySupport: "DDR5-5600, DDR4-3200",
      pcieLanes: "PCIe 5.0 x16 + PCIe 4.0 x4",
    },
    pros: ["Excellent gaming performance", "High core count", "Good overclocking potential", "Hybrid architecture"],
    cons: ["High power consumption", "Expensive", "Requires good cooling", "Limited efficiency cores"],
    performanceScore: 9.2,
    valueScore: 7.8,
    isPopular: true,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X",
    category: "CPU",
    brand: "AMD",
    price: 549.99,
    rating: 4.7,
    reviews: 189,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: "16",
      threads: "32",
      baseClock: "4.5 GHz",
      boostClock: "5.7 GHz",
      socket: "AM5",
      tdp: "170W",
      cache: "80MB",
      architecture: "Zen 4",
      manufacturing: "TSMC 5nm",
      integratedGraphics: "AMD Radeon Graphics",
      memorySupport: "DDR5-5200",
      pcieLanes: "PCIe 5.0 x24",
    },
    pros: ["Excellent multi-threading", "Good value", "Efficient architecture", "Large cache"],
    cons: ["High TDP", "Requires DDR5", "Expensive motherboards", "Limited gaming advantage"],
    performanceScore: 9.0,
    valueScore: 8.5,
    isPopular: true,
  },
  {
    id: 3,
    name: "Intel Core i7-14700K",
    category: "CPU",
    brand: "Intel",
    price: 389.99,
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: "20 (8P + 12E)",
      threads: "28",
      baseClock: "3.4 GHz",
      boostClock: "5.6 GHz",
      socket: "LGA1700",
      tdp: "125W",
      cache: "33MB",
      architecture: "Raptor Lake",
      manufacturing: "Intel 7",
      integratedGraphics: "Intel UHD Graphics 770",
      memorySupport: "DDR5-5600, DDR4-3200",
      pcieLanes: "PCIe 5.0 x16 + PCIe 4.0 x4",
    },
    pros: ["Great gaming performance", "Good price/performance", "Versatile", "Backward compatible"],
    cons: ["High power draw", "Needs good cooling", "Limited PCIe lanes", "Efficiency cores slower"],
    performanceScore: 8.5,
    valueScore: 8.8,
    isBestSeller: true,
  },
  {
    id: 4,
    name: "NVIDIA RTX 4080 Super",
    category: "GPU",
    brand: "NVIDIA",
    price: 999.99,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: "10240 CUDA Cores",
      baseClock: "2295 MHz",
      boostClock: "2550 MHz",
      memory: "16GB GDDR6X",
      memoryBus: "256-bit",
      bandwidth: "736 GB/s",
      tdp: "320W",
      architecture: "Ada Lovelace",
      manufacturing: "TSMC 4nm",
      rayTracing: "3rd Gen RT Cores",
      dlss: "DLSS 3",
      outputs: "3x DisplayPort 1.4a, 1x HDMI 2.1",
    },
    pros: ["Excellent 4K gaming", "Ray tracing performance", "DLSS 3 support", "16GB VRAM"],
    cons: ["Very expensive", "High power consumption", "Large size", "Overkill for 1080p"],
    performanceScore: 9.5,
    valueScore: 6.8,
    isNew: true,
  },
  {
    id: 5,
    name: "AMD Radeon RX 7800 XT",
    category: "GPU",
    brand: "AMD",
    price: 749.99,
    rating: 4.6,
    reviews: 98,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      cores: "3840 Stream Processors",
      baseClock: "2124 MHz",
      boostClock: "2430 MHz",
      memory: "16GB GDDR6",
      memoryBus: "256-bit",
      bandwidth: "624 GB/s",
      tdp: "263W",
      architecture: "RDNA 3",
      manufacturing: "TSMC 5nm",
      rayTracing: "2nd Gen Ray Accelerators",
      fsr: "FSR 3",
      outputs: "2x DisplayPort 2.1, 2x HDMI 2.1",
    },
    pros: ["Good value for money", "16GB VRAM", "Efficient power usage", "Strong rasterization"],
    cons: ["Weaker ray tracing", "No DLSS", "Less premium features", "Driver issues"],
    performanceScore: 8.2,
    valueScore: 8.9,
    isPopular: true,
  },
  {
    id: 6,
    name: "Corsair Vengeance DDR5-6000",
    category: "RAM",
    brand: "Corsair",
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      capacity: "32GB (2x16GB)",
      speed: "6000 MHz",
      latency: "CL30",
      voltage: "1.35V",
      type: "DDR5",
      timing: "30-36-36-76",
      jedec: "JEDEC Compliant",
      xmp: "XMP 3.0",
      heatspreader: "Aluminum",
      warranty: "Lifetime",
    },
    pros: ["High speed", "Good timings", "Reliable brand", "Lifetime warranty"],
    cons: ["Expensive", "Requires compatible motherboard", "High voltage", "Large heatspreader"],
    performanceScore: 8.5,
    valueScore: 7.8,
    isBestSeller: true,
  },
  {
    id: 7,
    name: "Samsung 980 PRO 2TB",
    category: "SSD",
    brand: "Samsung",
    price: 159.99,
    rating: 4.6,
    reviews: 312,
    image: "/placeholder.svg?height=200&width=200",
    specs: {
      capacity: "2TB",
      interface: "PCIe 4.0 x4",
      formFactor: "M.2 2280",
      controller: "Samsung Elpis",
      nand: "Samsung V-NAND 3-bit MLC",
      sequentialRead: "7000 MB/s",
      sequentialWrite: "6900 MB/s",
      randomRead: "1000K IOPS",
      randomWrite: "1000K IOPS",
      endurance: "1200 TBW",
      warranty: "5 years",
    },
    pros: ["Excellent performance", "High endurance", "Good warranty", "Reliable brand"],
    cons: ["Expensive per GB", "Gets hot under load", "Requires heatsink", "Overkill for basic use"],
    performanceScore: 9.0,
    valueScore: 7.5,
    isPopular: true,
  },
]

const categories = [
  { id: "CPU", name: "Processeurs", count: products.filter((p) => p.category === "CPU").length },
  { id: "GPU", name: "Cartes Graphiques", count: products.filter((p) => p.category === "GPU").length },
  { id: "RAM", name: "Mémoire", count: products.filter((p) => p.category === "RAM").length },
  { id: "SSD", name: "Stockage", count: products.filter((p) => p.category === "SSD").length },
]

const brands = [
  { id: "Intel", name: "Intel", count: products.filter((p) => p.brand === "Intel").length },
  { id: "AMD", name: "AMD", count: products.filter((p) => p.brand === "AMD").length },
  { id: "NVIDIA", name: "NVIDIA", count: products.filter((p) => p.brand === "NVIDIA").length },
  { id: "Corsair", name: "Corsair", count: products.filter((p) => p.brand === "Corsair").length },
  { id: "Samsung", name: "Samsung", count: products.filter((p) => p.brand === "Samsung").length },
]

interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  rating: number
  availability: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<typeof products>([])
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    brands: [],
    priceRange: [0, 2000],
    rating: 0,
    availability: "all",
    sortBy: "relevance",
    sortOrder: "desc",
  })
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)

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

  const addProduct = (product: (typeof products)[0]) => {
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

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        filters.search === "" ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand)
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesRating = product.rating >= filters.rating

      const matchesAvailability =
        filters.availability === "all" || (filters.availability === "in-stock" && product.rating > 0) // Simplified availability check

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesAvailability
    })
    .sort((a, b) => {
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
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ultimate Setup
            </Link>
            <nav className="hidden md:flex space-x-6" role="navigation" aria-label="Navigation principale">
              <Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                Catalogue
              </Link>
              <Link href="/configurator" className="text-muted-foreground hover:text-primary transition-colors">
                Configurateur
              </Link>
              <Link href="/compare" className="text-primary font-medium" aria-current="page">
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

      <main className="container mx-auto px-4 py-8" role="main">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comparateur Intelligent</h1>
              <p className="text-gray-600 mt-2">
                Comparez jusqu'à 4 composants avec analyse détaillée et scoring automatique
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Bookmark className="h-3 w-3" />
                <span>{selectedProducts.length}/4 sélectionnés</span>
              </Badge>
              {selectedProducts.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={exportComparison} className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareComparison} className="bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <ComparisonFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          brands={brands}
          isCollapsed={filtersCollapsed}
          onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
        />

        {/* Comparison Table */}
        <div className="mb-8">
          <ComparisonTable
            products={selectedProducts}
            onRemoveProduct={removeProduct}
            onUpdateNotes={updateNotes}
            onSaveComparison={saveComparison}
            onShareComparison={shareComparison}
          />
        </div>

        {/* Product Selector */}
        <ProductSelector
          products={filteredProducts}
          selectedProducts={selectedProducts}
          onAddProduct={addProduct}
          maxProducts={4}
        />

        {/* Help Section */}
        {selectedProducts.length === 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Comment utiliser le comparateur ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Sélectionnez jusqu'à 4 composants à comparer</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <p className="text-gray-700">Analysez les spécifications et scores de performance</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <p className="text-gray-700">Ajoutez des notes et sauvegardez votre comparaison</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
