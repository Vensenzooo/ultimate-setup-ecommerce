import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST /api/users/create - Créer un utilisateur après connexion Clerk
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { email, firstName, lastName, imageUrl } = await req.json()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Utilisateur existe déjà', 
        user: existingUser 
      })
    }

    // Créer l'utilisateur avec les données Clerk
    const user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: email || 'no-email@example.com',
        firstName: firstName || '',
        lastName: lastName || '',
        imageUrl: imageUrl || null,
      }
    })

    return NextResponse.json({ 
      message: 'Utilisateur créé avec succès', 
      user 
    })
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET /api/users/create - Vérifier si l'utilisateur existe
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ exists: false, needsAuth: true })
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    return NextResponse.json({ 
      exists: !!user, 
      user: user || null 
    })
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
