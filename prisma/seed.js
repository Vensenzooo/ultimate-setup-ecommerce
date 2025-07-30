const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer les catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'cpu' },
      update: {},
      create: {
        name: 'cpu',
        description: 'Processeurs haute performance',
      },
    }),
    prisma.category.upsert({
      where: { name: 'motherboard' },
      update: {},
      create: {
        name: 'motherboard',
        description: 'Cartes mères pour tous types de builds',
      },
    }),
    prisma.category.upsert({
      where: { name: 'gpu' },
      update: {},
      create: {
        name: 'gpu',
        description: 'Cartes graphiques gaming et workstation',
      },
    }),
    prisma.category.upsert({
      where: { name: 'ram' },
      update: {},
      create: {
        name: 'ram',
        description: 'Mémoire vive DDR4 et DDR5',
      },
    }),
    prisma.category.upsert({
      where: { name: 'storage' },
      update: {},
      create: {
        name: 'storage',
        description: 'Disques SSD et HDD',
      },
    }),
    prisma.category.upsert({
      where: { name: 'psu' },
      update: {},
      create: {
        name: 'psu',
        description: 'Alimentations modulaires et non-modulaires',
      },
    }),
    prisma.category.upsert({
      where: { name: 'cases' },
      update: {},
      create: {
        name: 'cases',
        description: 'Boîtiers ATX, mATX et ITX',
      },
    }),
    prisma.category.upsert({
      where: { name: 'cooling' },
      update: {},
      create: {
        name: 'cooling',
        description: 'Solutions de refroidissement air et liquide',
      },
    }),
  ]);

  console.log('✅ Catégories créées');

  // Créer les produits
  const products = [
    // CPUs
    {
      name: 'AMD Ryzen 9 7950X',
      description: 'Processeur 16 cœurs, 32 threads, 4.5GHz base, 5.7GHz boost',
      price: 599.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'cpu').id,
      stock: 25,
      specs: {
        cores: 16,
        threads: 32,
        baseClock: '4.5GHz',
        boostClock: '5.7GHz',
        socket: 'AM5',
        tdp: '170W'
      }
    },
    {
      name: 'Intel Core i9-13900K',
      description: 'Processeur 24 cœurs (8P+16E), 32 threads, jusqu\'à 5.8GHz',
      price: 589.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'cpu').id,
      stock: 30,
      specs: {
        cores: 24,
        threads: 32,
        baseClock: '3.0GHz',
        boostClock: '5.8GHz',
        socket: 'LGA1700',
        tdp: '125W'
      }
    },
    {
      name: 'AMD Ryzen 7 7700X',
      description: 'Processeur 8 cœurs, 16 threads, gaming et productivité',
      price: 349.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'cpu').id,
      stock: 40,
      specs: {
        cores: 8,
        threads: 16,
        baseClock: '4.5GHz',
        boostClock: '5.4GHz',
        socket: 'AM5',
        tdp: '105W'
      }
    },

    // GPUs
    {
      name: 'NVIDIA RTX 4090',
      description: 'Carte graphique flagship, 24GB GDDR6X, ray tracing ultime',
      price: 1599.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'gpu').id,
      stock: 15,
      specs: {
        memory: '24GB GDDR6X',
        memoryBus: '384-bit',
        cudaCores: 16384,
        baseClock: '2230MHz',
        boostClock: '2520MHz',
        interface: 'PCIe 4.0 x16'
      }
    },
    {
      name: 'AMD RX 7900 XTX',
      description: 'Carte graphique haut de gamme, 24GB GDDR6, RDNA 3',
      price: 999.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'gpu').id,
      stock: 20,
      specs: {
        memory: '24GB GDDR6',
        memoryBus: '384-bit',
        computeUnits: 96,
        gameClock: '2300MHz',
        boostClock: '2500MHz',
        interface: 'PCIe 4.0 x16'
      }
    },

    // Motherboards
    {
      name: 'ASUS ROG Strix X670E-E',
      description: 'Carte mère AMD X670E, WiFi 6E, PCIe 5.0, DDR5',
      price: 499.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'motherboard').id,
      stock: 12,
      specs: {
        socket: 'AM5',
        chipset: 'X670E',
        memorySupport: 'DDR5-5600',
        maxMemory: '128GB',
        expansion: '3x PCIe 5.0 x16',
        connectivity: 'WiFi 6E, Bluetooth 5.3'
      }
    },
    {
      name: 'MSI MAG Z790 Tomahawk',
      description: 'Carte mère Intel Z790, DDR5, PCIe 5.0, excellent rapport qualité-prix',
      price: 259.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'motherboard').id,
      stock: 18,
      specs: {
        socket: 'LGA1700',
        chipset: 'Z790',
        memorySupport: 'DDR5-5600',
        maxMemory: '128GB',
        expansion: '1x PCIe 5.0 x16, 2x PCIe 4.0 x16',
        connectivity: 'WiFi 6E, Bluetooth 5.3'
      }
    },

    // RAM
    {
      name: 'G.Skill Trident Z5 32GB DDR5-6000',
      description: 'Kit mémoire 2x16GB DDR5-6000 CL36, RGB, optimisé gaming',
      price: 289.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'ram').id,
      stock: 35,
      specs: {
        capacity: '32GB (2x16GB)',
        type: 'DDR5',
        speed: '6000MHz',
        timing: 'CL36-36-36-96',
        voltage: '1.35V',
        features: 'RGB, Intel XMP 3.0, AMD EXPO'
      }
    },
    {
      name: 'Corsair Vengeance LPX 32GB DDR4-3600',
      description: 'Kit mémoire 2x16GB DDR4-3600 CL18, profil bas, fiabilité éprouvée',
      price: 119.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'ram').id,
      stock: 50,
      specs: {
        capacity: '32GB (2x16GB)',
        type: 'DDR4',
        speed: '3600MHz',
        timing: 'CL18-22-22-42',
        voltage: '1.35V',
        features: 'Profil bas, Intel XMP 2.0'
      }
    },

    // Storage
    {
      name: 'Samsung 980 PRO 2TB',
      description: 'SSD NVMe PCIe 4.0, 7000MB/s lecture, parfait pour gaming et création',
      price: 199.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'storage').id,
      stock: 40,
      specs: {
        capacity: '2TB',
        interface: 'M.2 NVMe PCIe 4.0',
        readSpeed: '7000MB/s',
        writeSpeed: '5100MB/s',
        formFactor: 'M.2 2280',
        endurance: '1200TBW'
      }
    },
    {
      name: 'WD Black SN850X 1TB',
      description: 'SSD gaming NVMe PCIe 4.0, 7300MB/s, optimisé pour PlayStation 5',
      price: 129.99,
      imageUrl: '/placeholder.jpg',
      categoryId: categories.find(c => c.name === 'storage').id,
      stock: 30,
      specs: {
        capacity: '1TB',
        interface: 'M.2 NVMe PCIe 4.0',
        readSpeed: '7300MB/s',
        writeSpeed: '6600MB/s',
        formFactor: 'M.2 2280',
        features: 'Dissipateur inclus, compatible PS5'
      }
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('✅ Produits créés');
  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
