import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Package } from "lucide-react"
import { apiClient } from "@/lib/api/client"

interface SearchResult {
  id: number
  name: string
  category: string
  price: number
  image: string
  type: 'product'
}

interface GlobalSearchProps {
  className?: string
  placeholder?: string
}

export function GlobalSearch({ 
  className = "", 
  placeholder = "Rechercher des composants..." 
}: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fermer les résultats en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recherche avec debounce
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      try {
        // Utiliser la nouvelle API de recherche
        const params = new URLSearchParams({ 
          q: query,
          limit: '8'
        })
        const products = await apiClient.get<SearchResult[]>(`/api/search?${params}`)
        
        setResults(products)
        setIsOpen(true)
      } catch (error) {
        console.error('Erreur de recherche:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    setQuery("")
    
    if (result.type === 'product') {
      // Rediriger vers le catalogue avec le produit mis en évidence
      router.push(`/catalog?search=${encodeURIComponent(result.name)}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/catalog?search=${encodeURIComponent(query)}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Résultats de recherche */}
      {isOpen && (query.length >= 2) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-2">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Recherche en cours...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                  {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                </div>
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full p-3 text-left hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-8 h-8 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <Package className="h-5 w-5 text-gray-400 hidden" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {result.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {result.category}
                        </Badge>
                        <span className="text-sm font-medium text-blue-600">
                          {result.price}€
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Voir tous les résultats */}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push(`/catalog?search=${encodeURIComponent(query)}`)
                  }}
                  className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                >
                  Voir tous les résultats pour "{query}"
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun résultat pour "{query}"</p>
                <p className="text-xs mt-1">Essayez des termes plus généraux</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
