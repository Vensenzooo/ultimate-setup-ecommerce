"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Save,
  StickyNote,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"

interface ComparisonProduct {
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

interface ComparisonTableProps {
  products: ComparisonProduct[]
  onRemoveProduct: (id: number) => void
  onUpdateNotes: (id: number, notes: string) => void
  onSaveComparison: () => void
  onShareComparison: () => void
}

export function ComparisonTable({
  products,
  onRemoveProduct,
  onUpdateNotes,
  onSaveComparison,
  onShareComparison,
}: ComparisonTableProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [notesDialog, setNotesDialog] = useState<{ open: boolean; productId?: number }>({ open: false })

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Commencez votre comparaison</h3>
              <p className="text-gray-600 mt-2">
                Sélectionnez des composants pour les comparer côte à côte et prendre la meilleure décision.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <Badge variant="outline">Spécifications détaillées</Badge>
              <Badge variant="outline">Scores de performance</Badge>
              <Badge variant="outline">Rapport qualité-prix</Badge>
              <Badge variant="outline">Notes personnalisées</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50"
    if (score >= 6) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award className="h-4 w-4" />
    if (score >= 6) return <CheckCircle className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  const getBestValue = (key: string) => {
    if (key === "price") {
      return Math.min(...products.map((p) => p.price))
    }
    if (key === "rating") {
      return Math.max(...products.map((p) => p.rating))
    }
    return null
  }

  const isBestValue = (product: ComparisonProduct, key: string, value: any) => {
    const bestValue = getBestValue(key)
    return bestValue !== null && value === bestValue
  }

  const specKeys = products.length > 0 ? Object.keys(products[0].specs) : []

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comparaison ({products.length}/4)</h2>
          <p className="text-gray-600">Analysez les différences pour faire le meilleur choix</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onSaveComparison} className="bg-transparent">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" onClick={onShareComparison} className="bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Comparison Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="specs">Spécifications</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Comparaison des produits">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium w-48" scope="col">
                        Produit
                      </th>
                      {products.map((product) => (
                        <th key={product.id} className="text-center p-4 min-w-64" scope="col">
                          <div className="space-y-4">
                            <div className="relative">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={`Image de ${product.name}`}
                                width={120}
                                height={120}
                                className="mx-auto rounded-lg object-cover"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveProduct(product.id)}
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                aria-label={`Supprimer ${product.name} de la comparaison`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{product.name}</h3>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rating */}
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">Note</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
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
                            <span
                              className={`font-medium ${
                                isBestValue(product, "rating", product.rating) ? "text-green-600" : ""
                              }`}
                            >
                              {product.rating}
                            </span>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Price */}
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">Prix</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="space-y-1">
                            <div
                              className={`text-lg font-bold ${
                                isBestValue(product, "price", product.price) ? "text-green-600" : "text-primary"
                              }`}
                            >
                              {product.price}€
                              {isBestValue(product, "price", product.price) && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Meilleur prix
                                </Badge>
                              )}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">{product.originalPrice}€</div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Performance Score */}
                    {products.some((p) => p.performanceScore) && (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">Score Performance</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            {product.performanceScore && (
                              <div className="flex items-center justify-center space-x-2">
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                                    product.performanceScore,
                                  )}`}
                                >
                                  {getScoreIcon(product.performanceScore)}
                                  <span className="ml-1">{product.performanceScore}/10</span>
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Value Score */}
                    {products.some((p) => p.valueScore) && (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">Rapport Qualité-Prix</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            {product.valueScore && (
                              <div className="flex items-center justify-center space-x-2">
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                                    product.valueScore,
                                  )}`}
                                >
                                  {getScoreIcon(product.valueScore)}
                                  <span className="ml-1">{product.valueScore}/10</span>
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Actions */}
                    <tr>
                      <td className="p-4 font-medium">Actions</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4">
                          <div className="flex flex-col space-y-2">
                            <Button size="sm" className="w-full">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Ajouter au panier
                            </Button>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Heart className="h-4 w-4 mr-1" />
                                Favoris
                              </Button>
                              <Dialog
                                open={notesDialog.open && notesDialog.productId === product.id}
                                onOpenChange={(open) =>
                                  setNotesDialog({ open, productId: open ? product.id : undefined })
                                }
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    <StickyNote className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Notes pour {product.name}</DialogTitle>
                                    <DialogDescription>Ajoutez vos notes personnelles sur ce produit</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="notes">Vos notes</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Écrivez vos impressions, questions ou remarques..."
                                        value={product.notes || ""}
                                        onChange={(e) => onUpdateNotes(product.id, e.target.value)}
                                        rows={4}
                                      />
                                    </div>
                                    <div className="flex justify-end">
                                      <Button onClick={() => setNotesDialog({ open: false })}>Sauvegarder</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specs">
          <Card>
            <CardHeader>
              <CardTitle>Spécifications Techniques</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium w-48">Caractéristique</th>
                      {products.map((product) => (
                        <th key={product.id} className="text-center p-4 min-w-48">
                          <div className="text-sm font-medium">{product.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specKeys.map((specKey) => (
                      <tr key={specKey} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium capitalize">{specKey.replace(/([A-Z])/g, " $1").trim()}</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            <span className="text-sm">{product.specs[specKey] || "N/A"}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-lg">{product.name}</div>
                      <div className="text-sm text-gray-500 font-normal">{product.brand}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    {product.performanceScore && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{product.performanceScore}/10</div>
                        <div className="text-sm text-gray-600">Performance</div>
                      </div>
                    )}
                    {product.valueScore && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{product.valueScore}/10</div>
                        <div className="text-sm text-gray-600">Rapport Q/P</div>
                      </div>
                    )}
                  </div>

                  {/* Pros */}
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Points forts
                    </h4>
                    <ul className="space-y-1">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start">
                          <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Points faibles
                    </h4>
                    <ul className="space-y-1">
                      {product.cons.map((con, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start">
                          <Minus className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-lg">{product.name}</div>
                      <div className="text-sm text-gray-500 font-normal">{product.brand}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor={`notes-${product.id}`}>Vos notes personnelles</Label>
                    <Textarea
                      id={`notes-${product.id}`}
                      placeholder="Ajoutez vos impressions, questions ou remarques sur ce produit..."
                      value={product.notes || ""}
                      onChange={(e) => onUpdateNotes(product.id, e.target.value)}
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
