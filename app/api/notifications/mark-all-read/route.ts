import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
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

    // Marquer toutes les notifications comme lues
    await prisma.notification.updateMany({
      where: {
        OR: [
          { userId: user.id },
          { userId: null } // Notifications globales
        ],
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ message: 'Toutes les notifications marquées comme lues' })
  } catch (error) {
    console.error('Erreur API mark-all-read POST:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
