import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// PUT /api/cart/items/[id] - Mettre à jour la quantité d'un article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const itemId = parseInt(params.id)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "ID d'article invalide" }, { status: 400 })
    }

    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantité invalide" }, { status: 400 })
    }

    // Vérifier que l'article appartient à l'utilisateur
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          user: {
            clerkUserId: userId
          }
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    // Mettre à jour la quantité
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    // Retourner le panier mis à jour
    const cart = await prisma.cart.findFirst({
      where: {
        user: {
          clerkUserId: userId
        }
      },
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

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Erreur PUT /api/cart/items/[id]:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/items/[id] - Supprimer un article du panier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const itemId = parseInt(params.id)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "ID d'article invalide" }, { status: 400 })
    }

    // Vérifier que l'article appartient à l'utilisateur
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          user: {
            clerkUserId: userId
          }
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    // Supprimer l'article
    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    // Retourner le panier mis à jour
    const cart = await prisma.cart.findFirst({
      where: {
        user: {
          clerkUserId: userId
        }
      },
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

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Erreur DELETE /api/cart/items/[id]:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
