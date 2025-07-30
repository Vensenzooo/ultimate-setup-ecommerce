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

    // Récupérer les notifications de l'utilisateur
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId: user.id },
          { userId: null } // Notifications globales
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limiter à 50 notifications
    })

    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      link: notification.link,
      icon: notification.icon
    }))

    return NextResponse.json(formattedNotifications)
  } catch (error) {
    console.error('Erreur API notifications GET:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { type, title, message, link, icon, isGlobal } = await request.json()

    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Type, titre et message requis' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe et est admin pour les notifications globales
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (isGlobal && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seuls les admins peuvent créer des notifications globales' }, { status: 403 })
    }

    // Créer la notification
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        link,
        icon,
        userId: isGlobal ? null : user.id,
        isRead: false
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Erreur API notifications POST:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
