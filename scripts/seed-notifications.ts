import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedNotifications() {
  console.log('🔔 Création des notifications par défaut...')

  // Notifications globales (pour tous les utilisateurs)
  const globalNotifications = [
    {
      type: 'promotion',
      title: 'Soldes d\'hiver ! 🔥',
      message: 'Profitez de jusqu\'à -40% sur une sélection de composants gaming. Offre limitée dans le temps !',
      link: '/catalog',
    },
    {
      type: 'info',
      title: 'Nouveau configurateur disponible',
      message: 'Découvrez notre configurateur amélioré avec des suggestions intelligentes de compatibilité.',
      link: '/configurator',
    },
    {
      type: 'success',
      title: 'Livraison gratuite',
      message: 'Livraison gratuite pour toute commande supérieure à 100€. Profitez-en !',
      link: '/catalog',
    },
    {
      type: 'warning',
      title: 'Stock limité',
      message: 'Attention : stock limité sur les dernières cartes graphiques RTX 4080. Commandez vite !',
      link: '/catalog?category=gpu',
    }
  ]

  for (const notification of globalNotifications) {
    await prisma.notification.upsert({
      where: { id: `global-${notification.type}-${notification.title.slice(0, 10)}` },
      update: {},
      create: {
        id: `global-${notification.type}-${notification.title.slice(0, 10)}`,
        ...notification,
        userId: null, // Notification globale
        isRead: false,
      },
    })
  }

  console.log('✅ Notifications créées avec succès !')
}

seedNotifications()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
