"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  Package,
  CreditCard,
  HelpCircle,
  Trash2,
  Plus,
  Minus,
  UserPlus,
  LogIn,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { CartItem } from "@/hooks/use-cart-backend"

// Hook conditionnel pour Clerk
function useConditionalClerk() {
  const hasValidClerkKeys = 
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')

  // Si Clerk n'est pas configuré, retourner des valeurs par défaut
  if (!hasValidClerkKeys) {
    return {
      isSignedIn: false,
      user: null,
      isClerkAvailable: false
    }
  }

  // Sinon, essayer d'utiliser Clerk
  try {
    // Import dynamique de Clerk seulement si nécessaire
    const { useUser } = require("@clerk/nextjs")
    const { isSignedIn, user } = useUser()
    return {
      isSignedIn,
      user,
      isClerkAvailable: true
    }
  } catch (error) {
    console.warn('⚠️ Clerk not available, using fallback mode')
    return {
      isSignedIn: false,
      user: null,
      isClerkAvailable: false
    }
  }
}

// Composant Auth conditionnel
function AuthSection() {
  const { isSignedIn, isClerkAvailable } = useConditionalClerk()

  if (isClerkAvailable && isSignedIn) {
    // Utilisateur connecté avec Clerk
    try {
      const { UserButton } = require("@clerk/nextjs")
      return (
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8"
            }
          }}
          afterSignOutUrl="/"
        />
      )
    } catch (error) {
      console.warn('⚠️ UserButton not available')
    }
  }

  if (isClerkAvailable && !isSignedIn) {
    // Invité avec Clerk disponible
    try {
      const { SignInButton, SignUpButton } = require("@clerk/nextjs")
      return (
        <div className="flex items-center space-x-2">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Inscription</span>
            </Button>
          </SignUpButton>
        </div>
      )
    } catch (error) {
      console.warn('⚠️ Clerk buttons not available, using fallback')
    }
  }

  // Mode fallback - lien vers la page d'auth
  return (
    <div className="flex items-center space-x-2">
      <Link href="/auth">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Connexion</span>
        </Button>
      </Link>
      <Link href="/auth">
        <Button size="sm" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Inscription</span>
        </Button>
      </Link>
    </div>
  )
}

// Composant Auth mobile conditionnel
function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { isSignedIn, isClerkAvailable } = useConditionalClerk()

  if (isSignedIn) {
    return null // L'utilisateur connecté n'a pas besoin des boutons dans le menu mobile
  }

  if (isClerkAvailable) {
    try {
      const { SignInButton, SignUpButton } = require("@clerk/nextjs")
      return (
        <div className="mt-4 pt-4 border-t space-y-2">
          <SignInButton mode="modal">
            <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
              <LogIn className="mr-2 h-4 w-4" />
              Connexion
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="w-full justify-start" onClick={onClose}>
              <UserPlus className="mr-2 h-4 w-4" />
              Inscription
            </Button>
          </SignUpButton>
        </div>
      )
    } catch (error) {
      console.warn('⚠️ Clerk buttons not available, using fallback')
    }
  }

  // Mode fallback
  return (
    <div className="mt-4 pt-4 border-t space-y-2">
      <Link href="/auth">
        <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
          <LogIn className="mr-2 h-4 w-4" />
          Connexion
        </Button>
      </Link>
      <Link href="/auth">
        <Button className="w-full justify-start" onClick={onClose}>
          <UserPlus className="mr-2 h-4 w-4" />
          Inscription
        </Button>
      </Link>
    </div>
  )
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart()
  const items = cart?.items || []

  const navigation = [
    {
      name: "Catalogue",
      href: "/catalog",
      children: [
        { name: "Processeurs", href: "/catalog?category=cpu" },
        { name: "Cartes mères", href: "/catalog?category=motherboard" },
        { name: "Mémoire RAM", href: "/catalog?category=ram" },
        { name: "Cartes graphiques", href: "/catalog?category=gpu" },
        { name: "Stockage", href: "/catalog?category=storage" },
        { name: "Alimentations", href: "/catalog?category=psu" },
        { name: "Boîtiers", href: "/catalog?category=case" },
      ],
    },
    { name: "Configurateur", href: "/configurator" },
    { name: "Comparateur", href: "/compare" },
    { name: "Guides", href: "/guides" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">US</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ultimate Setup
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="font-medium">
                        {item.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="w-full">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href} className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input type="search" placeholder="Rechercher des composants..." className="pl-10 pr-4 w-full" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Mobile */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                2
              </Badge>
            </Button>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Panier ({getTotalItems()} articles)</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Votre panier est vide</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {items.map((item: CartItem) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <img
                              src={item.product.imageUrl || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{item.product.name}</h4>
                              <p className="text-sm text-gray-500">{item.product.price}€</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-lg">{getTotalPrice()}€</span>
                        </div>
                        <div className="space-y-2">
                          <Button className="w-full" size="lg">
                            Commander
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                            Vider le panier
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Auth Section */}
            <AuthSection />

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Buttons */}
              <MobileAuthSection onClose={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
