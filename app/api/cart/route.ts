import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/cart - Récupérer le panier de l'utilisateur
export async function GET() {
  try {
    const { userId } = await auth()
    
    // Si pas d'utilisateur connecté, retourner un panier vide pour invité
    if (!userId) {
      return NextResponse.json({ 
        id: null, 
        userId: null, 
        items: [], 
        isGuest: true 
      })
    }

    // Vérifier si l'utilisateur existe dans la DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé. Veuillez compléter votre profil d\'abord.',
        needsProfile: true 
      }, { status: 404 })
    }

    // Récupérer ou créer le panier
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Ajouter un produit au panier
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ 
        error: 'Connexion requise pour ajouter au panier',
        needsAuth: true 
      }, { status: 401 })
    }

    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'ID produit requis' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe dans la DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé. Veuillez compléter votre profil d\'abord.',
        needsProfile: true 
      }, { status: 404 })
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    // Récupérer ou créer le panier
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id }
      })
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    })

    if (existingItem) {
      // Mettre à jour la quantité
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
    } else {
      // Créer un nouvel article
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity
        }
      })
    }

    // Retourner le panier mis à jour
    const updatedCart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Vider le panier
export async function DELETE() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si l'utilisateur existe dans la DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé. Veuillez compléter votre profil d\'abord.',
        needsProfile: true 
      }, { status: 404 })
    }

    // Supprimer tous les articles du panier
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: user.id
        }
      }
    })

    return NextResponse.json({ message: 'Panier vidé avec succès' })
  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
