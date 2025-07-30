import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les informations utilisateur depuis Clerk
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Utilisateur déjà synchronisé',
        user: existingUser 
      })
    }

    // Créer l'utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
      }
    });

    return NextResponse.json({
      message: 'Utilisateur synchronisé avec succès',
      user: newUser
    })

  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation de l\'utilisateur' },
      { status: 500 }
    )
  }
}
