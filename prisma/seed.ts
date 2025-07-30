import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du seeding...')

  // Supprimer les données existantes dans le bon ordre (à cause des contraintes de clés étrangères)
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Créer des catégories
  console.log('📁 Création des catégories...')
  
  const cpuCategory = await prisma.category.create({
    data: {
      name: 'cpu'
    }
  })

  const motherboardCategory = await prisma.category.create({
    data: {
      name: 'motherboard'
    }
  })

  const ramCategory = await prisma.category.create({
    data: {
      name: 'ram'
    }
  })

  const gpuCategory = await prisma.category.create({
    data: {
      name: 'gpu'
    }
  })

  const storageCategory = await prisma.category.create({
    data: {
      name: 'storage'
    }
  })

  const caseCategory = await prisma.category.create({
    data: {
      name: 'case'
    }
  })

  const psuCategory = await prisma.category.create({
    data: {
      name: 'psu'
    }
  })

  const coolerCategory = await prisma.category.create({
    data: {
      name: 'cooler'
    }
  })

  console.log('💾 Création des produits...')

  // Créer des produits
  await prisma.product.createMany({
    data: [
      // CPU
      {
        name: 'Intel Core i7-13700K',
        price: 409.99,
        stock: 15,
        categoryId: cpuCategory.id
      },
      {
        name: 'AMD Ryzen 7 7700X',
        price: 349.99,
        stock: 12,
        categoryId: cpuCategory.id
      },
      {
        name: 'Intel Core i9-13900K',
        price: 589.99,
        stock: 8,
        categoryId: cpuCategory.id
      },
      {
        name: 'AMD Ryzen 5 7600X',
        price: 249.99,
        stock: 20,
        categoryId: cpuCategory.id
      },
      {
        name: 'Intel Core i5-13600K',
        price: 299.99,
        stock: 18,
        categoryId: cpuCategory.id
      },
      {
        name: 'AMD Ryzen 9 7950X',
        price: 699.99,
        stock: 5,
        categoryId: cpuCategory.id
      },
      
      // Motherboards
      {
        name: 'ASUS ROG STRIX Z790-E',
        price: 399.99,
        stock: 10,
        categoryId: motherboardCategory.id
      },
      {
        name: 'MSI B650 TOMAHAWK',
        price: 229.99,
        stock: 14,
        categoryId: motherboardCategory.id
      },
      {
        name: 'GIGABYTE B550 AORUS PRO',
        price: 179.99,
        stock: 16,
        categoryId: motherboardCategory.id
      },
      {
        name: 'ASUS TUF Gaming X570-PLUS',
        price: 199.99,
        stock: 12,
        categoryId: motherboardCategory.id
      },
      {
        name: 'MSI Z790 Gaming Pro WiFi',
        price: 279.99,
        stock: 11,
        categoryId: motherboardCategory.id
      },
      
      // RAM
      {
        name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200',
        price: 129.99,
        stock: 25,
        categoryId: ramCategory.id
      },
      {
        name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000',
        price: 199.99,
        stock: 18,
        categoryId: ramCategory.id
      },
      {
        name: 'Corsair Vengeance DDR5 16GB (2x8GB) DDR5-5600',
        price: 89.99,
        stock: 30,
        categoryId: ramCategory.id
      },
      {
        name: 'G.Skill Ripjaws V 32GB (2x16GB) DDR4-3600',
        price: 109.99,
        stock: 22,
        categoryId: ramCategory.id
      },
      {
        name: 'Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5-5200',
        price: 449.99,
        stock: 8,
        categoryId: ramCategory.id
      },
      
      // GPU
      {
        name: 'NVIDIA GeForce RTX 4070',
        price: 599.99,
        stock: 6,
        categoryId: gpuCategory.id
      },
      {
        name: 'AMD Radeon RX 7700 XT',
        price: 449.99,
        stock: 9,
        categoryId: gpuCategory.id
      },
      {
        name: 'NVIDIA GeForce RTX 4090',
        price: 1599.99,
        stock: 3,
        categoryId: gpuCategory.id
      },
      {
        name: 'AMD Radeon RX 7900 XTX',
        price: 999.99,
        stock: 4,
        categoryId: gpuCategory.id
      },
      {
        name: 'NVIDIA GeForce RTX 4060 Ti',
        price: 399.99,
        stock: 12,
        categoryId: gpuCategory.id
      },
      {
        name: 'AMD Radeon RX 7600',
        price: 269.99,
        stock: 15,
        categoryId: gpuCategory.id
      },
      
      // Storage
      {
        name: 'Samsung 980 PRO 1TB NVMe SSD',
        price: 109.99,
        stock: 35,
        categoryId: storageCategory.id
      },
      {
        name: 'WD Black SN850X 2TB NVMe SSD',
        price: 199.99,
        stock: 20,
        categoryId: storageCategory.id
      },
      {
        name: 'Crucial MX4 1TB SATA SSD',
        price: 79.99,
        stock: 28,
        categoryId: storageCategory.id
      },
      {
        name: 'Seagate Barracuda 4TB HDD',
        price: 89.99,
        stock: 40,
        categoryId: storageCategory.id
      },
      {
        name: 'Samsung 990 EVO 4TB NVMe SSD',
        price: 449.99,
        stock: 8,
        categoryId: storageCategory.id
      },
      
      // Cases
      {
        name: 'NZXT H7 Flow ATX Mid-Tower',
        price: 139.99,
        stock: 15,
        categoryId: caseCategory.id
      },
      {
        name: 'Corsair 4000D Airflow ATX Mid-Tower',
        price: 104.99,
        stock: 18,
        categoryId: caseCategory.id
      },
      {
        name: 'Fractal Design Define 7 ATX Full-Tower',
        price: 179.99,
        stock: 12,
        categoryId: caseCategory.id
      },
      {
        name: 'Lian Li PC-O11 Dynamic ATX Mid-Tower',
        price: 149.99,
        stock: 10,
        categoryId: caseCategory.id
      },
      
      // PSU
      {
        name: 'Corsair RM850x 850W 80+ Gold Modular',
        price: 149.99,
        stock: 20,
        categoryId: psuCategory.id
      },
      {
        name: 'EVGA SuperNOVA 750 G5 750W 80+ Gold',
        price: 129.99,
        stock: 16,
        categoryId: psuCategory.id
      },
      {
        name: 'Seasonic Focus GX-1000 1000W 80+ Gold',
        price: 199.99,
        stock: 12,
        categoryId: psuCategory.id
      },
      {
        name: 'be quiet! Straight Power 11 650W 80+ Gold',
        price: 109.99,
        stock: 22,
        categoryId: psuCategory.id
      },
      
      // Coolers
      {
        name: 'Noctua NH-D15 CPU Air Cooler',
        price: 109.99,
        stock: 25,
        categoryId: coolerCategory.id
      },
      {
        name: 'Corsair H100i RGB PLATINUM AIO 240mm',
        price: 149.99,
        stock: 18,
        categoryId: coolerCategory.id
      },
      {
        name: 'be quiet! Dark Rock Pro 4 CPU Air Cooler',
        price: 89.99,
        stock: 20,
        categoryId: coolerCategory.id
      },
      {
        name: 'Arctic Liquid Freezer II 280mm AIO',
        price: 119.99,
        stock: 15,
        categoryId: coolerCategory.id
      },
      {
        name: 'NZXT Kraken X73 360mm AIO',
        price: 199.99,
        stock: 10,
        categoryId: coolerCategory.id
      }
    ]
  })

  console.log('✅ Seeding terminé!')
  console.log('📊 Catégories créées: 8')
  console.log('📦 Produits créés: 43')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
