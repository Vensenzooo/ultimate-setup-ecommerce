import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'anonymous'
    
    const configurations = await prisma.configuration.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(configurations)
  } catch (error) {
    console.error('Erreur lors du chargement des configurations:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des configurations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, components, notes, totalPrice, userId = 'anonymous' } = body

    const configuration = await prisma.configuration.create({
      data: {
        name,
        components: JSON.stringify(components),
        notes: JSON.stringify(notes || {}),
        totalPrice,
        userId
      }
    })

    return NextResponse.json(configuration)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de configuration manquant' },
        { status: 400 }
      )
    }

    await prisma.configuration.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la configuration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la configuration' },
      { status: 500 }
    )
  }
}
