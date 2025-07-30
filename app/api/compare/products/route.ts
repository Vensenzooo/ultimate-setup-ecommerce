import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Récupérer les produits avec les catégories
    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== 'all' && {
          category: {
            name: {
              contains: category
            }
          }
        }),
        ...(brand && {
          name: {
            contains: brand
          }
        }),
        ...(minPrice && {
          price: {
            gte: parseFloat(minPrice)
          }
        }),
        ...(maxPrice && {
          price: {
            lte: parseFloat(maxPrice)
          }
        })
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformer les données pour la comparaison
    const enhancedProducts = products.map(product => {
      // Extraire la marque du nom du produit
      const nameParts = product.name.split(' ')
      const brand = nameParts[0] // Premier mot comme marque
      
      // Générer des scores de performance et de valeur
      const performanceScore = Math.round((product.price / 100) + Math.random() * 20 + 60)
      const valueScore = Math.round(100 - (product.price / 50) + Math.random() * 30)
      
      // Générer des pros et cons basés sur le produit
      const pros = generatePros(product.name, product.category.name)
      const cons = generateCons(product.name, product.category.name)
      
      // Générer des caractéristiques
      const features = generateFeatures(product.category.name)

      return {
        id: product.id,
        name: product.name,
        category: mapCategoryToCompareCategory(product.category.name),
        brand: brand,
        price: product.price,
        originalPrice: Math.random() > 0.7 ? product.price * 1.2 : undefined,
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
        reviews: Math.floor(Math.random() * 500 + 50),
        stock: product.stock,
        image: product.imageUrl || '/placeholder.jpg',
        specs: product.specs || generateDefaultSpecs(product.category.name, product.name),
        description: product.description,
        features,
        pros,
        cons,
        performanceScore: Math.min(100, performanceScore),
        valueScore: Math.min(100, Math.max(10, valueScore)),
        isPopular: Math.random() > 0.8,
        isNew: Math.random() > 0.9,
        isBestSeller: Math.random() > 0.85,
        notes: ''
      }
    })

    return NextResponse.json(enhancedProducts)

  } catch (error) {
    console.error('Erreur API comparaison:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des produits' },
      { status: 500 }
    )
  }
}

// Mapper les catégories de la DB vers les catégories de comparaison
function mapCategoryToCompareCategory(dbCategory: string): string {
  const mapping: Record<string, string> = {
    'Processeurs': 'CPU',
    'Cartes graphiques': 'GPU', 
    'Mémoire RAM': 'RAM',
    'Stockage': 'SSD',
    'Cartes mères': 'Motherboard',
    'Alimentations': 'PSU',
    'Boîtiers': 'Case'
  }
  
  return mapping[dbCategory] || dbCategory
}

// Générer des pros basés sur le produit
function generatePros(productName: string, category: string): string[] {
  const name = productName.toLowerCase()
  const prosMap: Record<string, string[]> = {
    'Processeurs': [
      'Excellentes performances single-thread',
      'Bon rapport performance/consommation',
      'Compatible avec les dernières technologies',
      'Overclocking facile',
      'Refroidissement efficace'
    ],
    'Cartes graphiques': [
      'Ray tracing excellent',
      'Performances 4K fluides',
      'Refroidissement silencieux',
      'Consommation optimisée',
      'Excellent pour le streaming'
    ],
    'Mémoire RAM': [
      'Vitesses élevées',
      'Latences optimisées',
      'Compatibilité étendue',
      'Overclocking stable',
      'Design élégant'
    ],
    'Stockage': [
      'Vitesses de lecture exceptionnelles',
      'Excellente endurance',
      'Faible consommation',
      'Installation facile',
      'Garantie longue durée'
    ]
  }

  const defaultPros = prosMap[category] || ['Bonne qualité', 'Fiable', 'Bon support']
  return defaultPros.slice(0, 3)
}

// Générer des cons basés sur le produit  
function generateCons(productName: string, category: string): string[] {
  const consMap: Record<string, string[]> = {
    'Processeurs': [
      'Prix élevé',
      'Chauffe sous charge',
      'Consommation importante'
    ],
    'Cartes graphiques': [
      'Taille imposante',
      'Consommation élevée',
      'Prix premium'
    ],
    'Mémoire RAM': [
      'Prix par GB élevé',
      'Compatibilité limitée',
      'RGB peut être excessif'
    ],
    'Stockage': [
      'Prix au TB élevé',
      'Capacité limitée',
      'Chauffe en usage intensif'
    ]
  }

  const defaultCons = consMap[category] || ['Prix élevé', 'Disponibilité limitée']
  return defaultCons.slice(0, 2)
}

// Générer des caractéristiques
function generateFeatures(category: string): string[] {
  const featuresMap: Record<string, string[]> = {
    'Processeurs': [
      'Architecture avancée',
      'Support DDR5',
      'PCIe 5.0',
      'Instructions AVX-512',
      'Sécurité intégrée'
    ],
    'Cartes graphiques': [
      'Ray Tracing RT Core',
      'DLSS/FSR Support',
      'PCIe 4.0',
      'Encodage AV1',
      'Multi-écrans'
    ],
    'Mémoire RAM': [
      'Profils XMP',
      'Dissipateurs thermiques',
      'RGB synchronisé',
      'Overclocking 1-click',
      'Compatibilité Intel/AMD'
    ],
    'Stockage': [
      'Interface PCIe 4.0',
      'Cache DRAM',
      'Chiffrement matériel',
      'Gestion thermique',
      'Logiciel de migration'
    ]
  }

  return featuresMap[category] || ['Qualité premium', 'Installation facile', 'Support technique']
}

// Générer des specs par défaut
function generateDefaultSpecs(category: string, productName: string): Record<string, string | number> {
  const name = productName.toLowerCase()
  
  if (category === 'Processeurs') {
    return {
      socket: name.includes('intel') ? 'LGA1700' : 'AM5',
      cores: name.includes('i9') || name.includes('7950') ? 16 : name.includes('i7') || name.includes('7800') ? 8 : 6,
      threads: name.includes('i9') || name.includes('7950') ? 32 : name.includes('i7') || name.includes('7800') ? 16 : 12,
      baseClock: '3.4 GHz',
      boostClock: '5.2 GHz',
      cache: '32 MB',
      tdp: '125W'
    }
  }
  
  if (category === 'Cartes graphiques') {
    return {
      memory: name.includes('4080') ? '16 GB' : name.includes('4070') ? '12 GB' : '8 GB',
      memoryType: 'GDDR6X',
      coreClock: '2200 MHz',
      boostClock: '2500 MHz',
      rtCores: name.includes('nvidia') ? 'Oui' : 'Non',
      dlss: name.includes('nvidia') ? 'DLSS 3' : 'FSR 3',
      powerDraw: '250W'
    }
  }
  
  if (category === 'Mémoire RAM') {
    return {
      capacity: name.includes('32') ? '32 GB' : '16 GB',
      type: 'DDR5',
      speed: '6000 MHz',
      latency: 'CL30',
      voltage: '1.35V',
      channels: '2 x 16GB'
    }
  }
  
  if (category === 'Stockage') {
    return {
      capacity: name.includes('2tb') || name.includes('2to') ? '2 TB' : '1 TB',
      interface: 'PCIe 4.0 x4',
      formFactor: 'M.2 2280',
      readSpeed: '7000 MB/s',
      writeSpeed: '6500 MB/s',
      endurance: '1200 TBW'
    }
  }

  return {
    type: 'Standard',
    performance: 'Élevée',
    compatibility: 'Universelle'
  }
}
