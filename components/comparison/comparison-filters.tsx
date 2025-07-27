"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"

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

interface ComparisonFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: Array<{ id: string; name: string; count: number }>
  brands: Array<{ id: string; name: string; count: number }>
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function ComparisonFilters({
  filters,
  onFiltersChange,
  categories,
  brands,
  isCollapsed,
  onToggleCollapse,
}: ComparisonFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

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
      priceRange: [0, 2000],
      rating: 0,
      availability: "all",
      sortBy: "relevance",
      sortOrder: "desc",
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const activeFiltersCount =
    localFilters.categories.length +
    localFilters.brands.length +
    (localFilters.search ? 1 : 0) +
    (localFilters.rating > 0 ? 1 : 0) +
    (localFilters.availability !== "all" ? 1 : 0)

  if (isCollapsed) {
    return (
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={onToggleCollapse}
          className="flex items-center space-x-2 bg-transparent"
          aria-expanded={false}
          aria-controls="comparison-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des composants..."
              value={localFilters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
              aria-label="Rechercher des composants"
            />
          </div>
        </div>

        <Select value={localFilters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger className="w-48" aria-label="Trier par">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Pertinence</SelectItem>
            <SelectItem value="price">Prix</SelectItem>
            <SelectItem value="rating">Note</SelectItem>
            <SelectItem value="name">Nom</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <Card className="mb-6" id="comparison-filters">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres de Comparaison</span>
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} actifs</Badge>}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} aria-label="Réduire les filtres">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search-input">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search-input"
              placeholder="Nom du composant, marque, modèle..."
              value={localFilters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Label>Catégories</Label>
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
                <Label htmlFor={`category-${category.id}`} className="text-sm flex-1">
                  {category.name}
                  <span className="text-muted-foreground ml-1">({category.count})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div className="space-y-3">
          <Label>Marques</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
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
                <Label htmlFor={`brand-${brand.id}`} className="text-sm flex-1">
                  {brand.name}
                  <span className="text-muted-foreground ml-1">({brand.count})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label>
            Prix: {localFilters.priceRange[0]}€ - {localFilters.priceRange[1]}€
          </Label>
          <Slider
            value={localFilters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={2000}
            step={50}
            className="w-full"
            aria-label="Fourchette de prix"
          />
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <Label>Note minimum</Label>
          <Select
            value={localFilters.rating.toString()}
            onValueChange={(value) => updateFilters({ rating: Number.parseFloat(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Toutes les notes</SelectItem>
              <SelectItem value="3">3+ étoiles</SelectItem>
              <SelectItem value="4">4+ étoiles</SelectItem>
              <SelectItem value="4.5">4.5+ étoiles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <Label>Disponibilité</Label>
          <Select value={localFilters.availability} onValueChange={(value) => updateFilters({ availability: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les produits</SelectItem>
              <SelectItem value="in-stock">En stock</SelectItem>
              <SelectItem value="low-stock">Stock faible</SelectItem>
              <SelectItem value="pre-order">Pré-commande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Sort */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Trier par</Label>
            <Select value={localFilters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Pertinence</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="release-date">Date de sortie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ordre</Label>
            <Select
              value={localFilters.sortOrder}
              onValueChange={(value) => updateFilters({ sortOrder: value as "asc" | "desc" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Décroissant</SelectItem>
                <SelectItem value="asc">Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
