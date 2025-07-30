import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, ShoppingCart } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader className="pb-8">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
                404
              </CardTitle>
              <p className="text-xl text-gray-600">
                Page non trouvée
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Désolé, nous n'avons pas pu trouver la page que vous recherchez. 
                Elle a peut-être été déplacée ou n'existe plus.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Voir le catalogue
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à{' '}
                  <a href="mailto:support@ultimate-setup.com" className="text-blue-600 hover:underline">
                    nous contacter
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
