import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface Component {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  specifications: Record<string, string | number>;
  compatibility?: Record<string, string | number | string[]>;
  badges: string[];
  rating: number;
  pros?: string[];
  cons?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Si une catégorie spécifique est demandée
    if (category) {
      const products = await prisma.product.findMany({
        where: {
          category: {
            name: category
          }
        },
        include: {
          category: true
        },
        orderBy: {
          name: 'asc'
        }
      })

      // Transformer les produits en format Component
      const components = products.map((product: any) => ({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.jpg',
        description: product.description || '',
        specifications: product.specs || {},
        compatibility: {},
        badges: ["En stock"],
        rating: 4.5,
        pros: [],
        cons: []
      }))

      return NextResponse.json({ [category]: components })
    }

    // Sinon, récupérer tous les composants par catégorie
    const categories = await prisma.category.findMany({
      include: {
        products: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    })

    // Mapping des noms de catégories de la base vers les noms attendus par le configurateur
    const categoryMapping: Record<string, string> = {
      'cpu': 'cpu',
      'motherboard': 'motherboard', 
      'ram': 'ram',
      'gpu': 'gpu',
      'storage': 'storage',
      'psu': 'psu',
      'case': 'case',
      'cooler': 'cooler'
    }

    const componentsData: Record<string, Component[]> = {}

    categories.forEach((cat: any) => {
      const components = cat.products.map((product: any) => {
        // Utiliser les spécifications directement de la base de données
        let specs = product.specs || {}
        let badges: string[] = []
        let pros: string[] = []
        let cons: string[] = []

        // Déterminer les badges en fonction des spécifications réelles du produit
        if (product.stock > 0) badges.push("En stock")
        if (product.stock < 5 && product.stock > 0) badges.push("Stock limité")
        if (product.price < 100) badges.push("Économique")
        if (product.price > 500) badges.push("Premium")
        
        // Ajouter des badges basés sur les spécifications existantes
        if (specs.rgb === true || specs.RGB === "Oui" || product.name.toLowerCase().includes('rgb')) {
          badges.push("RGB")
        }
        if (specs.gaming === true || product.name.toLowerCase().includes('gaming')) {
          badges.push("Gaming")
        }
        if (specs.rayTracing === true || specs.ray_tracing === "Oui") {
          badges.push("Ray Tracing")
        }
        if (specs.modular === true || specs.modulaire === "Oui") {
          badges.push("Modulaire")
        }
        if (specs.wifi === true || specs.WiFi === "Oui" || product.name.toLowerCase().includes('wifi')) {
          badges.push("WiFi")
        }

        // Générer pros/cons basés sur les spécifications existantes
        const categoryName = categoryMapping[cat.name] || cat.name.toLowerCase()
        
        // Extraire les pros et cons des spécifications si elles existent
        if (specs.pros && Array.isArray(specs.pros)) {
          pros = specs.pros
        } else if (specs.avantages && Array.isArray(specs.avantages)) {
          pros = specs.avantages
        }
        
        if (specs.cons && Array.isArray(specs.cons)) {
          cons = specs.cons  
        } else if (specs.inconvenients && Array.isArray(specs.inconvenients)) {
          cons = specs.inconvenients
        }

        // Calculer le rating basé sur les spécifications et le prix
        let rating = 4.0
        if (specs.performance === "Haute" || specs.performance === "High") rating += 0.5
        if (specs.efficiency === "Haute" || specs.efficacite === "Haute") rating += 0.3
        if (product.price > 300) rating += 0.2
        rating = Math.min(rating, 5.0)

        return {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.imageUrl || '/placeholder.jpg',
          description: product.description || `${product.name} - Composant ${categoryName} de qualité`,
          specifications: specs,
          compatibility: {
            socket: specs.socket || specs.Socket,
            wattage: specs.wattage || specs.puissance,
            type: specs.type || specs.Type,
            minPsu: specs.minPsu || specs.alimentation_min,
            maxRam: specs.maxRam || specs.ram_max,
            ramType: specs.ramType || specs.type_ram
          },
          badges,
          rating: Math.round(rating * 10) / 10,
          pros,
          cons
        }
      })

      // Utiliser le mapping pour associer la bonne clé
      const mappedName = categoryMapping[cat.name] || cat.name.toLowerCase()
      componentsData[mappedName] = components
    })

    return NextResponse.json(componentsData)
    
  } catch (error) {
    console.error('Erreur API components:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des composants' },
      { status: 500 }
    )
  }
}
