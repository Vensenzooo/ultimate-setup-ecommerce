import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'CPU' },
      update: {},
      create: { name: 'CPU', description: 'Processeurs' },
    }),
    prisma.category.upsert({
      where: { name: 'GPU' },
      update: {},
      create: { name: 'GPU', description: 'Cartes graphiques' },
    }),
    prisma.category.upsert({
      where: { name: 'RAM' },
      update: {},
      create: { name: 'RAM', description: 'Mémoire vive' },
    }),
    prisma.category.upsert({
      where: { name: 'SSD' },
      update: {},
      create: { name: 'SSD', description: 'Stockage SSD' },
    }),
  ])

  // Créer des produits de test
  const products = [
    {
      name: 'Intel Core i7-13700K',
      description: 'Processeur Intel Core i7 de 13e génération',
      price: 389.99,
      stock: 15,
      categoryId: categories[0].id,
      imageUrl: '/placeholder.jpg',
    },
    {
      name: 'AMD Ryzen 7 7700X',
      description: 'Processeur AMD Ryzen 7 de série 7000',
      price: 349.99,
      stock: 12,
      categoryId: categories[0].id,
      imageUrl: '/placeholder.jpg',
    },
    {
      name: 'NVIDIA RTX 4070 Ti',
      description: 'Carte graphique NVIDIA GeForce RTX 4070 Ti',
      price: 799.99,
      stock: 8,
      categoryId: categories[1].id,
      imageUrl: '/placeholder.jpg',
    },
    {
      name: 'AMD RX 7800 XT',
      description: 'Carte graphique AMD Radeon RX 7800 XT',
      price: 649.99,
      stock: 6,
      categoryId: categories[1].id,
      imageUrl: '/placeholder.jpg',
    },
    {
      name: 'Corsair Vengeance 32GB DDR5',
      description: 'Kit mémoire DDR5 32GB (2x16GB) 5600MHz',
      price: 159.99,
      stock: 20,
      categoryId: categories[2].id,
      imageUrl: '/placeholder.jpg',
    },
    {
      name: 'Samsung 980 PRO 1TB',
      description: 'SSD NVMe M.2 1TB Samsung 980 PRO',
      price: 89.99,
      stock: 25,
      categoryId: categories[3].id,
      imageUrl: '/placeholder.jpg',
    },
  ]

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    })
    
    if (!existing) {
      await prisma.product.create({
        data: product
      })
    }
  }

  console.log('✅ Données de test créées avec succès !')
  console.log(`📦 ${categories.length} catégories créées`)
  console.log(`🛍️ ${products.length} produits créés`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création des données de test:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
