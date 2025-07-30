"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Upload, Download, Package, AlertTriangle, TrendingUp } from "lucide-react"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"

const columns = [
  {
    key: "image",
    label: "Image",
    render: (value: string) => (
      <Image
        src={value || "/placeholder.svg"}
        alt="Product"
        width={50}
        height={50}
        className="rounded-lg object-cover"
      />
    ),
  },
  {
    key: "name",
    label: "Nom du Produit",
    sortable: true,
  },
  {
    key: "category",
    label: "Catégorie",
    render: (value: string) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "brand",
    label: "Marque",
  },
  {
    key: "price",
    label: "Prix",
    render: (value: number) => `€${value}`,
  },
  {
    key: "stock",
    label: "Stock",
    render: (value: number) => (
      <Badge variant={value > 10 ? "default" : value > 0 ? "secondary" : "destructive"}>{value}</Badge>
    ),
  },
  {
    key: "status",
    label: "Statut",
    render: (value: string) => (
      <Badge variant={value === "Actif" ? "default" : value === "Stock Faible" ? "secondary" : "destructive"}>
        {value}
      </Badge>
    ),
  },
  {
    key: "sales",
    label: "Ventes",
  },
]

export default function ProductsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
  })

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    apiClient.get<any[]>("products")
      .then(setProducts)
      .catch((err) => setError(err.message || "Erreur de chargement"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreateProduct = () => {
    // Logic to create product
    console.log("Creating product:", newProduct)
    setIsCreateDialogOpen(false)
    setNewProduct({
      name: "",
      category: "",
      brand: "",
      price: "",
      stock: "",
      description: "",
    })
  }

  const handleEdit = (product: any) => {
    console.log("Editing product:", product)
  }

  const handleDelete = (product: any) => {
    console.log("Deleting product:", product)
  }

  const handleView = (product: any) => {
    console.log("Viewing product:", product)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-600 mt-1">Gérez votre catalogue de produits et suivez les performances</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Produit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau produit</DialogTitle>
                  <DialogDescription>Ajoutez un nouveau produit à votre catalogue</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="specs">Spécifications</TabsTrigger>
                    <TabsTrigger value="media">Médias</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Ex: Intel Core i9-14900K"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Marque</Label>
                        <Input
                          id="brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          placeholder="Ex: Intel"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CPU">CPU</SelectItem>
                            <SelectItem value="GPU">GPU</SelectItem>
                            <SelectItem value="RAM">RAM</SelectItem>
                            <SelectItem value="SSD">SSD</SelectItem>
                            <SelectItem value="Motherboard">Carte Mère</SelectItem>
                            <SelectItem value="PSU">Alimentation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Prix (€)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Description détaillée du produit..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="specs" className="space-y-4">
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Spécifications techniques à implémenter</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="media" className="space-y-4">
                    <div className="text-center py-8">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Upload d'images à implémenter</p>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateProduct}>Créer le produit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Produits</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock Faible</p>
                  <p className="text-2xl font-bold text-orange-600">23</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ruptures</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventes Totales</p>
                  <p className="text-2xl font-bold text-green-600">12,456</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Catalogue de Produits</CardTitle>
            <CardDescription>Gérez tous vos produits depuis cette interface</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <DataTable
                data={products}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectable
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
