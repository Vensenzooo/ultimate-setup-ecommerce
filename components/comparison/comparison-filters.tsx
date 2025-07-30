"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, X, SlidersHorizontal, RotateCcw, Star } from "lucide-react"

interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  rating: number
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface ComparisonFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: Array<{ id: string; name: string; count: number }>
  brands: Array<{ id: string; name: string; count: number }>
  productsCount?: number
}

export function ComparisonFilters({
  filters,
  onFiltersChange,
  categories,
  brands,
  productsCount = 0,
}: ComparisonFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  // Synchroniser avec les filtres externes
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...localFilters, ...updates }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      categories: [],
      brands: [],
      priceRange: [0, 5000],
      rating: 0,
      sortBy: "name",
      sortOrder: "asc",
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const activeFiltersCount = 
    (localFilters.search ? 1 : 0) +
    (localFilters.categories.length > 0 ? 1 : 0) +
    (localFilters.brands.length > 0 ? 1 : 0) +
    (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 5000 ? 1 : 0) +
    (localFilters.rating > 0 ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtres avancés</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Recherche */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Rechercher un produit
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Nom, marque, modèle..."
            value={localFilters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
          {localFilters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilters({ search: "" })}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Catégories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Catégories</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={localFilters.categories.includes(category.id)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...localFilters.categories, category.id]
                    : localFilters.categories.filter((c) => c !== category.id)
                  updateFilters({ categories: newCategories })
                }}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Marques */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Marques</Label>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={localFilters.brands.includes(brand.id)}
                onCheckedChange={(checked) => {
                  const newBrands = checked
                    ? [...localFilters.brands, brand.id]
                    : localFilters.brands.filter((b) => b !== brand.id)
                  updateFilters({ brands: newBrands })
                }}
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Prix */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Fourchette de prix: {localFilters.priceRange[0]}€ - {localFilters.priceRange[1]}€
        </Label>
        <Slider
          value={localFilters.priceRange}
          onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
          max={5000}
          min={0}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0€</span>
          <span>5000€+</span>
        </div>
      </div>

      <Separator />

      {/* Note minimale */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Note minimale
          {localFilters.rating > 0 && (
            <span className="ml-2 text-yellow-600">
              {localFilters.rating}+ <Star className="inline h-3 w-3 fill-current" />
            </span>
          )}
        </Label>
        <Slider
          value={[localFilters.rating]}
          onValueChange={(value) => updateFilters({ rating: value[0] })}
          max={5}
          min={0}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Toutes</span>
          <span>5★ uniquement</span>
        </div>
      </div>

      <Separator />

      {/* Tri */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Trier par</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={localFilters.sortBy}
            onValueChange={(value) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="rating">Note</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="value">Rapport qualité/prix</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={localFilters.sortOrder}
            onValueChange={(value) => updateFilters({ sortOrder: value as "asc" | "desc" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Croissant</SelectItem>
              <SelectItem value="desc">Décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Résultat */}
      {productsCount > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>{productsCount}</strong> produit{productsCount > 1 ? 's' : ''} trouvé{productsCount > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
