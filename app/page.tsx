import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Cpu, HardDrive, Monitor, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredProducts = [
  {
    id: 1,
    name: "Intel Core i9-14900K",
    category: "CPU",
    price: 589.99,
    originalPrice: 649.99,
    rating: 4.8,
    reviews: 234,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "NVIDIA RTX 4080 Super",
    category: "GPU",
    price: 999.99,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Nouveau",
  },
  {
    id: 3,
    name: "Corsair Vengeance DDR5-6000",
    category: "RAM",
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Promo",
  },
  {
    id: 4,
    name: "Samsung 980 PRO 2TB",
    category: "SSD",
    price: 159.99,
    rating: 4.6,
    reviews: 312,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Recommandé",
  },
]

const categories = [
  { name: "Processeurs", icon: Cpu, count: 45, color: "bg-blue-500" },
  { name: "Cartes Graphiques", icon: Monitor, count: 32, color: "bg-green-500" },
  { name: "Stockage", icon: HardDrive, count: 67, color: "bg-purple-500" },
  { name: "Alimentations", icon: Zap, count: 28, color: "bg-orange-500" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Configurez votre PC Gaming parfait</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez notre sélection de composants haut de gamme et utilisez notre configurateur intelligent pour
            assembler le PC de vos rêves avec vérification de compatibilité automatique.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/configurator">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Commencer ma config
              </Button>
            </Link>
            <Link href="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Voir le catalogue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Catégories populaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
                  <p className="text-muted-foreground">{category.count} produits</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold">Produits vedettes</h3>
            <Link href="/catalog">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <h4 className="font-semibold text-sm">{product.name}</h4>
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
                    <Button className="w-full" size="sm">
                      Ajouter au panier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Ultimate Setup ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-6 h-6 text-blue-500" />
                  <span>Compatibilité garantie</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notre système vérifie automatiquement la compatibilité entre tous vos composants pour éviter les
                  erreurs de configuration.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <span>Recommandations IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bénéficiez de recommandations personnalisées basées sur votre budget, vos besoins et votre historique
                  d'achats.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-green-500" />
                  <span>Support expert</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notre équipe d'experts est là pour vous accompagner dans le choix et l'assemblage de votre
                  configuration idéale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Ultimate Setup</h4>
              <p className="text-muted-foreground text-sm">
                Votre partenaire de confiance pour assembler le PC gaming parfait.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Produits</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/catalog?category=cpu">Processeurs</Link>
                </li>
                <li>
                  <Link href="/catalog?category=gpu">Cartes graphiques</Link>
                </li>
                <li>
                  <Link href="/catalog?category=ram">Mémoire</Link>
                </li>
                <li>
                  <Link href="/catalog?category=storage">Stockage</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/configurator">Configurateur PC</Link>
                </li>
                <li>
                  <Link href="/compare">Comparateur</Link>
                </li>
                <li>
                  <Link href="/support">Support technique</Link>
                </li>
                <li>
                  <Link href="/assembly">Service d'assemblage</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Informations</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">À propos</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/privacy">Confidentialité</Link>
                </li>
                <li>
                  <Link href="/terms">CGV</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ultimate Setup. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
