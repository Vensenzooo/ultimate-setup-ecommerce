"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Heart,
  Bell,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  Package,
  UserPlus,
  LogIn,
} from "lucide-react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { CartSidebar } from "@/components/cart-sidebar"
import { FavoritesSidebar } from "@/components/favorites-sidebar"
import { NotificationsSidebar } from "@/components/notifications-sidebar"
import { GlobalSearch } from "@/components/global-search"
import { useUserSync } from "@/hooks/use-user-sync"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()
  const { syncUser, isSyncing, isSynced, needsSync } = useUserSync()

  const handleSyncUser = async () => {
    await syncUser()
  }

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
                      <Button variant="ghost" className="font-medium text-gray-700 hover:text-blue-600">
                        {item.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
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
            <GlobalSearch />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <FavoritesSidebar />

            {/* Notifications */}
            <NotificationsSidebar />

            {/* Cart */}
            <CartSidebar />

            {/* User Menu */}
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {/* Indicateur de synchronisation avec bouton */}
                {needsSync ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSyncUser}
                    disabled={isSyncing}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    {isSyncing ? 'Synchronisation...' : 'Activer profil'}
                  </Button>
                ) : isSynced && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Package className="mr-1 h-3 w-3" />
                    Profil actif
                  </Badge>
                )}
                
                {/* UserButton de Clerk avec photo de profil */}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Inscription</span>
                  </Button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            {/* Mobile Search */}
            <div className="px-3 mb-4">
              <GlobalSearch />
            </div>
            
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
              
              {/* Mobile Auth Buttons for Guests */}
              {!isSignedIn && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <SignInButton>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Connexion
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Inscription
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
