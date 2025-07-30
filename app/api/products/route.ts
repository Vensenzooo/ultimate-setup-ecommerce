import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Construire les filtres
    const where: any = {};

    // Filtrer par catégorie
    if (category && category !== 'all') {
      where.category = {
        name: category
      };
    }

    // Filtrer par recherche (MySQL ne supporte pas mode: 'insensitive')
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // Calculer la pagination
    const limitNum = limit ? parseInt(limit) : undefined;
    const pageNum = page ? parseInt(page) : 1;
    const skip = limitNum && pageNum ? (pageNum - 1) * limitNum : undefined;

    // Récupérer les produits avec les relations
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      take: limitNum,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formater la réponse pour correspondre au format attendu par le frontend
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      category: product.category.name,
      specs: product.specs
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, price, categoryId, stock } = data;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        stock: parseInt(stock),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 