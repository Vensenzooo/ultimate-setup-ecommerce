"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ShoppingCart,
  Menu,
  UserPlus,
  LogIn,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart-new"
import { CartSidebar } from "@/components/cart-sidebar"
import { toast } from "sonner"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { isSignedIn, user, isLoaded } = useUser()
  const syncAttempted = useRef(false)

  // Synchronisation automatique après connexion
  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn || !user || syncAttempted.current) return
      
      syncAttempted.current = true
      
      try {
        // Attendre 2 secondes après la connexion pour s'assurer que tout est prêt
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const response = await fetch('/api/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (response.ok) {
          toast.success("Compte synchronisé avec succès!", {
            description: `Bienvenue ${user.firstName || user.emailAddresses[0]?.emailAddress}!`
          })
        } else {
          console.error('Erreur de synchronisation:', data.error)
          // Ne pas afficher d'erreur à l'utilisateur si c'est juste un doublon
          if (!data.error?.includes('déjà synchronisé')) {
            toast.error("Erreur de synchronisation du compte")
          }
        }
      } catch (error) {
        console.error('Erreur de synchronisation:', error)
        // Pas de toast d'erreur pour ne pas perturber l'expérience utilisateur
      }
    }

    // Déclencher la sync seulement si l'utilisateur vient de se connecter
    if (isLoaded && isSignedIn && user) {
      syncUser()
    }
  }, [isSignedIn, user, isLoaded])

  // Reset du flag lors de la déconnexion
  useEffect(() => {
    if (!isSignedIn) {
      syncAttempted.current = false
    }
  }, [isSignedIn])

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue", href: "/catalog" },
    { name: "Comparateur", href: "/compare" },
    { name: "Configurateur", href: "/configurator" },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">US</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Ultimate Setup</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <CartSidebar />

            {/* User Menu */}
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
                afterSignOutUrl="/"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inscription
                  </Button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
