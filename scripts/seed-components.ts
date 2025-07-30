import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedComponents() {
  console.log('🌱 Ajout des composants PC...')

  // Créer les catégories de composants
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Processeurs' },
      update: {},
      create: {
        name: 'Processeurs',
        description: 'CPU pour ordinateurs de bureau'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Cartes mères' },
      update: {},
      create: {
        name: 'Cartes mères',
        description: 'Cartes mères pour AMD et Intel'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Mémoire RAM' },
      update: {},
      create: {
        name: 'Mémoire RAM',
        description: 'Mémoire vive DDR4 et DDR5'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Cartes graphiques' },
      update: {},
      create: {
        name: 'Cartes graphiques',
        description: 'GPU NVIDIA et AMD'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Stockage' },
      update: {},
      create: {
        name: 'Stockage',
        description: 'SSD NVMe et SATA'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Alimentations' },
      update: {},
      create: {
        name: 'Alimentations',
        description: 'Blocs d\'alimentation modulaires et non-modulaires'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Boîtiers' },
      update: {},
      create: {
        name: 'Boîtiers',
        description: 'Boîtiers PC ATX et mATX'
      }
    })
  ])

  // Créer les produits composants
  const components = [
    // Processeurs
    {
      name: 'AMD Ryzen 7 7800X3D',
      price: 449,
      categoryId: categories[0].id,
      stock: 15,
      description: 'Processeur gaming haut de gamme avec cache 3D V-Cache pour des performances exceptionnelles en jeu',
      specs: {
        socket: 'AM5',
        cores: 8,
        threads: 16,
        baseClock: '4.2 GHz',
        boostClock: '5.0 GHz',
        cache: '96 MB',
        tdp: '120W'
      }
    },
    {
      name: 'Intel Core i7-13700K',
      price: 419,
      categoryId: categories[0].id,
      stock: 12,
      description: 'Processeur Intel 13ème génération pour gaming et productivité avec architecture hybride',
      specs: {
        socket: 'LGA1700',
        cores: 16,
        threads: 24,
        baseClock: '3.4 GHz',
        boostClock: '5.4 GHz',
        cache: '30 MB',
        tdp: '125W'
      }
    },
    {
      name: 'AMD Ryzen 5 7600X',
      price: 299,
      categoryId: categories[0].id,
      stock: 20,
      description: 'Processeur gaming 6 cœurs avec excellent rapport qualité/prix',
      specs: {
        socket: 'AM5',
        cores: 6,
        threads: 12,
        baseClock: '4.7 GHz',
        boostClock: '5.3 GHz',
        cache: '32 MB',
        tdp: '105W'
      }
    },
    // Cartes mères
    {
      name: 'ASUS ROG STRIX X670E-E',
      price: 499,
      categoryId: categories[1].id,
      stock: 8,
      description: 'Carte mère premium AM5 avec Wi-Fi 6E, PCIe 5.0 et excellent VRM',
      specs: {
        socket: 'AM5',
        chipset: 'X670E',
        ramSlots: 4,
        maxRam: '128 GB',
        ramSpeed: 'DDR5-6000+',
        wifi: 'Wi-Fi 6E',
        ethernet: '2.5 Gigabit'
      }
    },
    {
      name: 'MSI MAG B650 TOMAHAWK',
      price: 259,
      categoryId: categories[1].id,
      stock: 15,
      description: 'Carte mère B650 équilibrée pour gaming mainstream avec PCIe 4.0',
      specs: {
        socket: 'AM5',
        chipset: 'B650',
        ramSlots: 4,
        maxRam: '128 GB',
        ramSpeed: 'DDR5-5600+',
        wifi: 'Non',
        ethernet: 'Gigabit'
      }
    },
    // RAM
    {
      name: 'Corsair Vengeance DDR5-6000 32GB',
      price: 179,
      categoryId: categories[2].id,
      stock: 25,
      description: 'Kit mémoire DDR5 haute performance 2x16GB avec refroidissement efficace',
      specs: {
        capacity: '32 GB (2x16GB)',
        type: 'DDR5',
        speed: '6000 MHz',
        latency: 'CL30',
        voltage: '1.35V',
        heatspreader: 'Oui'
      }
    },
    {
      name: 'G.Skill Trident Z5 DDR5-5600 16GB',
      price: 89,
      categoryId: categories[2].id,
      stock: 30,
      description: 'Kit mémoire DDR5 gaming 2x8GB avec éclairage RGB synchronisable',
      specs: {
        capacity: '16 GB (2x8GB)',
        type: 'DDR5',
        speed: '5600 MHz',
        latency: 'CL28',
        voltage: '1.25V',
        heatspreader: 'Oui'
      }
    },
    // Cartes graphiques
    {
      name: 'NVIDIA RTX 4080 SUPER',
      price: 1199,
      categoryId: categories[3].id,
      stock: 6,
      description: 'Carte graphique haut de gamme pour 4K gaming avec Ray Tracing et DLSS 3.5',
      specs: {
        memory: '16 GB GDDR6X',
        coreClock: '2295 MHz',
        boostClock: '2550 MHz',
        rayTracing: 'Oui',
        dlss: 'DLSS 3.5',
        length: '304 mm',
        slots: 3
      }
    },
    {
      name: 'AMD Radeon RX 7700 XT',
      price: 499,
      categoryId: categories[3].id,
      stock: 10,
      description: 'Carte graphique 1440p gaming avec 12GB VRAM et FSR 3.0',
      specs: {
        memory: '12 GB GDDR6',
        coreClock: '2171 MHz',
        boostClock: '2544 MHz',
        rayTracing: 'Oui',
        fsr: 'FSR 3.0',
        length: '267 mm',
        slots: 2.5
      }
    },
    // Stockage
    {
      name: 'Samsung 980 PRO 2TB NVMe',
      price: 199,
      categoryId: categories[4].id,
      stock: 18,
      description: 'SSD NVMe PCIe 4.0 ultra-rapide pour gaming et création de contenu',
      specs: {
        capacity: '2 TB',
        interface: 'PCIe 4.0 x4',
        formFactor: 'M.2 2280',
        readSpeed: '7000 MB/s',
        writeSpeed: '6900 MB/s',
        endurance: '1200 TBW',
        warranty: '5 ans'
      }
    },
    {
      name: 'Western Digital SN770 1TB',
      price: 89,
      categoryId: categories[4].id,
      stock: 25,
      description: 'SSD NVMe abordable pour gaming avec bonnes performances',
      specs: {
        capacity: '1 TB',
        interface: 'PCIe 3.0 x4',
        formFactor: 'M.2 2280',
        readSpeed: '3500 MB/s',
        writeSpeed: '3000 MB/s',
        endurance: '600 TBW',
        warranty: '5 ans'
      }
    },
    // Alimentations
    {
      name: 'Corsair RM850x 850W 80+ Gold',
      price: 149,
      categoryId: categories[5].id,
      stock: 12,
      description: 'Alimentation modulaire silencieuse 850W avec garantie 10 ans',
      specs: {
        wattage: '850W',
        efficiency: '80+ Gold',
        modular: 'Fully Modular',
        fanSize: '135mm',
        warranty: '10 ans',
        cables: 'Sleeved'
      }
    },
    {
      name: 'Seasonic Focus GX-750 750W',
      price: 119,
      categoryId: categories[5].id,
      stock: 15,
      description: 'Alimentation 750W efficace et fiable de Seasonic',
      specs: {
        wattage: '750W',
        efficiency: '80+ Gold',
        modular: 'Fully Modular',
        fanSize: '120mm',
        warranty: '10 ans',
        cables: 'Flat'
      }
    },
    // Boîtiers
    {
      name: 'Fractal Design Define 7 Compact',
      price: 129,
      categoryId: categories[6].id,
      stock: 10,
      description: 'Boîtier compact silencieux avec panneau en verre trempé',
      specs: {
        formFactor: 'Mid Tower',
        motherboardSupport: 'ATX, mATX, ITX',
        maxGpuLength: '315 mm',
        fanSupport: '3x 120mm inclus',
        radiatorSupport: '240mm/280mm',
        sidePanels: 'Verre trempé'
      }
    },
    {
      name: 'Corsair 4000D Airflow',
      price: 99,
      categoryId: categories[6].id,
      stock: 14,
      description: 'Boîtier gaming avec excellent airflow et facilité de montage',
      specs: {
        formFactor: 'Mid Tower',
        motherboardSupport: 'ATX, mATX, ITX',
        maxGpuLength: '360 mm',
        fanSupport: '3x 120mm inclus',
        radiatorSupport: '240mm/360mm',
        sidePanels: 'Verre trempé'
      }
    }
  ]

  for (const component of components) {
    try {
      await prisma.product.create({
        data: {
          name: component.name,
          price: component.price,
          categoryId: component.categoryId,
          stock: component.stock,
          description: component.description,
          imageUrl: '/placeholder.jpg',
          specs: component.specs
        }
      })
      console.log(`✅ Ajouté: ${component.name}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⏭️  Déjà existant: ${component.name}`)
      } else {
        console.error(`❌ Erreur pour ${component.name}:`, error.message)
      }
    }
  }

  console.log('✅ Composants PC ajoutés avec succès !')
}

async function main() {
  try {
    await seedComponents()
    console.log('🎉 Seeding terminé avec succès !')
  } catch (error) {
    console.error('❌ Erreur durant le seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main
