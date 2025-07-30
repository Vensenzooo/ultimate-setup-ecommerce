import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer les favoris avec les détails du produit
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedFavorites = favorites.map(favorite => ({
      id: favorite.id,
      productId: favorite.product.id,
      productName: favorite.product.name,
      productPrice: favorite.product.price,
      productImage: favorite.product.imageUrl,
      productDescription: favorite.product.description,
      productCategory: favorite.product.category.name,
      addedAt: favorite.createdAt
    }))

    return NextResponse.json(formattedFavorites)
  } catch (error) {
    console.error('Erreur API favoris GET:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'ID produit requis' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    // Vérifier si le produit n'est pas déjà en favoris
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        productId: productId
      }
    })

    if (existingFavorite) {
      return NextResponse.json({ error: 'Produit déjà en favoris' }, { status: 409 })
    }

    // Ajouter aux favoris
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        productId: productId
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    const formattedFavorite = {
      id: favorite.id,
      productId: favorite.product.id,
      productName: favorite.product.name,
      productPrice: favorite.product.price,
      productImage: favorite.product.imageUrl,
      productDescription: favorite.product.description,
      productCategory: favorite.product.category.name,
      addedAt: favorite.createdAt
    }

    return NextResponse.json(formattedFavorite, { status: 201 })
  } catch (error) {
    console.error('Erreur API favoris POST:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (productId) {
      // Supprimer un favori spécifique
      const deleted = await prisma.favorite.deleteMany({
        where: {
          userId: user.id,
          productId: productId
        }
      })

      if (deleted.count === 0) {
        return NextResponse.json({ error: 'Favori non trouvé' }, { status: 404 })
      }

      return NextResponse.json({ message: 'Favori supprimé' })
    } else {
      // Supprimer tous les favoris de l'utilisateur
      await prisma.favorite.deleteMany({
        where: { userId: user.id }
      })

      return NextResponse.json({ message: 'Tous les favoris supprimés' })
    }
  } catch (error) {
    console.error('Erreur API favoris DELETE:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
