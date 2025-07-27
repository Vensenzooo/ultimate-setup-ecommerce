"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { User, Package, ShoppingCart, Heart, Settings, Download, Edit, Trash2, Share, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const userConfigurations = [
  {
    id: 1,
    name: "Gaming Beast 4K",
    components: {
      cpu: "Intel Core i9-14900K",
      gpu: "NVIDIA RTX 4080 Super",
      ram: "32GB DDR5-6000",
      storage: "2TB NVMe SSD",
    },
    totalPrice: 2899.99,
    createdAt: "2025-01-15",
    lastModified: "2025-01-18",
    status: "Complète",
  },
  {
    id: 2,
    name: "Workstation Pro",
    components: {
      cpu: "AMD Ryzen 9 7950X",
      gpu: "NVIDIA RTX 4070 Super",
      ram: "64GB DDR5-5600",
      storage: "1TB NVMe SSD",
    },
    totalPrice: 2299.99,
    createdAt: "2025-01-10",
    lastModified: "2025-01-12",
    status: "En cours",
  },
  {
    id: 3,
    name: "Budget Gaming",
    components: {
      cpu: "AMD Ryzen 5 7600X",
      gpu: "AMD RX 7700 XT",
      ram: "16GB DDR5-5600",
      storage: "1TB NVMe SSD",
    },
    totalPrice: 1299.99,
    createdAt: "2025-01-05",
    lastModified: "2025-01-05",
    status: "Complète",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    date: "2025-01-18",
    status: "Livré",
    total: 2899.99,
    items: 8,
  },
  {
    id: "ORD-002",
    date: "2025-01-10",
    status: "En transit",
    total: 1299.99,
    items: 6,
  },
  {
    id: "ORD-003",
    date: "2024-12-28",
    status: "Livré",
    total: 599.99,
    items: 3,
  },
]

const wishlistItems = [
  {
    id: 1,
    name: "Intel Core i9-14900KS",
    price: 699.99,
    image: "/placeholder.svg?height=60&width=60",
    inStock: true,
  },
  {
    id: 2,
    name: "NVIDIA RTX 4090",
    price: 1599.99,
    image: "/placeholder.svg?height=60&width=60",
    inStock: false,
  },
  {
    id: 3,
    name: "G.Skill Trident Z5 RGB",
    price: 349.99,
    image: "/placeholder.svg?height=60&width=60",
    inStock: true,
  },
]

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ultimate Setup
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/catalog" className="text-muted-foreground hover:text-primary">
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
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Gérez vos configurations, commandes et préférences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="configurations">Configurations</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="wishlist">Liste de souhaits</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Configurations</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Commandes</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Liste de souhaits</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
                      <p className="text-2xl font-bold text-gray-900">€4,799</p>
                    </div>
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurations Récentes</CardTitle>
                  <CardDescription>Vos dernières configurations PC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userConfigurations.slice(0, 3).map((config) => (
                      <div key={config.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{config.name}</p>
                          <p className="text-xs text-gray-500">Modifié le {config.lastModified}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">€{config.totalPrice.toLocaleString()}</p>
                          <Badge variant={config.status === "Complète" ? "default" : "secondary"} className="text-xs">
                            {config.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Voir toutes les configurations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commandes Récentes</CardTitle>
                  <CardDescription>Historique de vos dernières commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {order.date} • {order.items} articles
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">€{order.total.toLocaleString()}</p>
                          <Badge
                            variant={
                              order.status === "Livré"
                                ? "default"
                                : order.status === "En transit"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Voir toutes les commandes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurations Tab */}
          <TabsContent value="configurations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes Configurations</h2>
                <p className="text-gray-600">Gérez vos configurations PC sauvegardées</p>
              </div>
              <Link href="/configurator">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Nouvelle Configuration
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userConfigurations.map((config) => (
                <Card key={config.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <Badge variant={config.status === "Complète" ? "default" : "secondary"}>{config.status}</Badge>
                    </div>
                    <CardDescription>Créé le {config.createdAt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CPU:</span>
                        <span className="font-medium">{config.components.cpu}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">GPU:</span>
                        <span className="font-medium">{config.components.gpu}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">RAM:</span>
                        <span className="font-medium">{config.components.ram}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-medium">{config.components.storage}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold text-primary">€{config.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
              <p className="text-gray-600">Suivez l'état de vos commandes</p>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-gray-500">Commandé le {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">€{order.total.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{order.items} articles</p>
                        </div>
                        <Badge
                          variant={
                            order.status === "Livré"
                              ? "default"
                              : order.status === "En transit"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </div>
                    {order.status === "En transit" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progression de la livraison</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ma Liste de Souhaits</h2>
              <p className="text-gray-600">Produits que vous souhaitez acheter</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-lg font-bold text-primary">€{item.price}</p>
                        <Badge variant={item.inStock ? "default" : "secondary"} className="text-xs mt-1">
                          {item.inStock ? "En stock" : "Rupture"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1" disabled={!item.inStock}>
                        Ajouter au panier
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
              <p className="text-gray-600">Gérez vos informations personnelles</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Interface de gestion du profil en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
