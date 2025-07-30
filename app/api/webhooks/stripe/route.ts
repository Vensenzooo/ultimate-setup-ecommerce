import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('❌ Erreur signature webhook Stripe:', err.message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    console.log(`✅ Webhook Stripe reçu: ${event.type}`)

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`🤷‍♂️ Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const orderId = session.metadata?.order_id

    if (!orderId) {
      console.error('❌ Order ID manquant dans les métadonnées de session')
      return
    }

    console.log(`🛒 Commande complétée: ${orderId}`)

    // Mettre à jour la commande
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'paid',
        // Ajoutons les nouveaux champs plus tard quand Prisma sera à jour
      }
    })

    // Vider le panier de l'utilisateur
    const userId = session.metadata?.user_id
    if (userId) {
      const cart = await prisma.cart.findFirst({
        where: { userId: parseInt(userId) }
      })

      if (cart) {
        // Supprimer tous les items du panier
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        })

        console.log(`🗑️ Panier vidé pour l'utilisateur ${userId}`)
      }
    }

    console.log(`✅ Commande ${orderId} mise à jour avec succès`)

  } catch (error) {
    console.error('❌ Erreur handleCheckoutSessionCompleted:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.order_id

    if (!orderId) {
      console.error('❌ Order ID manquant dans PaymentIntent')
      return
    }

    console.log(`💳 Paiement réussi pour commande: ${orderId}`)

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'paid'
      }
    })

  } catch (error) {
    console.error('❌ Erreur handlePaymentIntentSucceeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.order_id

    if (!orderId) {
      console.error('❌ Order ID manquant dans PaymentIntent')
      return
    }

    console.log(`❌ Paiement échoué pour commande: ${orderId}`)

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'cancelled'
      }
    })

  } catch (error) {
    console.error('❌ Erreur handlePaymentIntentFailed:', error)
  }
}
