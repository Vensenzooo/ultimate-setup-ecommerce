import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { isRead } = await request.json()
    const notificationId = params.id

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Mettre à jour la notification
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        OR: [
          { userId: user.id },
          { userId: null } // Notifications globales
        ]
      },
      data: { isRead }
    })

    if (notification.count === 0) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Notification mise à jour' })
  } catch (error) {
    console.error('Erreur API notification PATCH:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const notificationId = params.id

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Supprimer la notification
    const deleted = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: user.id // Seules les notifications personnelles peuvent être supprimées
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Notification supprimée' })
  } catch (error) {
    console.error('Erreur API notification DELETE:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
