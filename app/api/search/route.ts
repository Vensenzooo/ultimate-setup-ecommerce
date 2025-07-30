import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Rechercher dans les produits avec Prisma (MySQL ne supporte pas mode: 'insensitive')
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { name: { contains: query } } }
        ]
      },
      include: {
        category: true
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    })

    // Formater les résultats pour le frontend
    const results = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      type: 'product' as const,
      category: product.category.name,
      price: product.price,
      imageUrl: product.imageUrl
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error('Erreur API search:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}
