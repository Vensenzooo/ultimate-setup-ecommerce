import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construire les filtres de recherche
    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ]
    }

    // Récupérer les utilisateurs avec pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          clerkUserId: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              carts: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur API users:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des utilisateurs' },
      { status: 500 }
    )
  }
}

// POST /api/users - Synchroniser l'utilisateur Clerk avec la DB
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { clerkUserId, email, firstName, lastName, imageUrl } = data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId }
    });

    if (existingUser) {
      // Mettre à jour les informations si elles ont changé
      const updatedUser = await prisma.user.update({
        where: { clerkUserId },
        data: {
          email,
          firstName,
          lastName,
          imageUrl,
        }
      });
      return NextResponse.json(updatedUser);
    }

    // Créer l'utilisateur dans la DB
    const newUser = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        firstName,
        lastName,
        imageUrl,
        role: 'user', // Par défaut
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating/syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to create/sync user' },
      { status: 500 }
    );
  }
} 