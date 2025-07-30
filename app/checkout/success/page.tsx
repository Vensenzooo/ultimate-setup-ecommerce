"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, ArrowRight, Home } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Order {
  id: number
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  items: Array<{
    id: number
    quantity: number
    price: number
    product: {
      name: string
      description?: string
      imageUrl?: string
      category: {
        name: string
      }
    }
  }>
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        setError('Session ID manquant')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/by-session/${sessionId}`)
        if (!response.ok) {
          throw new Error('Commande non trouvée')
        }
        const orderData = await response.json()
        setOrder(orderData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre achat. Votre commande #{order.id} a été traitée avec succès.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la commande */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Articles commandés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.imageUrl || "/placeholder.jpg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.description}</p>
                      <Badge variant="secondary" className="mt-1">
                        {item.product.category.name}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.quantity} × {item.price.toFixed(2)}€</div>
                      <div className="text-sm text-gray-600">
                        Total: {(item.quantity * item.price).toFixed(2)}€
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prochaines étapes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Prochaines étapes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Commande confirmée</p>
                      <p className="text-sm text-gray-600">Votre paiement a été traité</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Préparation en cours</p>
                      <p className="text-sm text-gray-600">Nous préparons votre commande</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Expédition</p>
                      <p className="text-sm text-gray-600">Vous recevrez un email de suivi</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé commande */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Commande #{order.id}</span>
                    <Badge 
                      variant={order.status === 'paid' ? 'default' : 'secondary'}
                    >
                      {order.status === 'paid' ? 'Payée' : order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Articles</span>
                    <span>{order.items.length}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-blue-600">{order.total.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Link href="/client/orders">
                    <Button className="w-full">
                      Voir mes commandes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Continuer mes achats
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>📧 support@ultimate-setup.com</p>
                <p>📞 01 23 45 67 89</p>
                <p className="text-gray-600">
                  Notre équipe est disponible du lundi au vendredi de 9h à 18h.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
