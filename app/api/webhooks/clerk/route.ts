import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the event
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  try {
    switch (eventType) {
      case 'user.created':
        // Create user in database
        await prisma.user.create({
          data: {
            clerkUserId: evt.data.id,
            email: evt.data.email_addresses[0]?.email_address || '',
            firstName: evt.data.first_name || '',
            lastName: evt.data.last_name || '',
          }
        })
        console.log('User created in database')
        break

      case 'user.updated':
        // Update user in database
        await prisma.user.update({
          where: { clerkUserId: evt.data.id },
          data: {
            email: evt.data.email_addresses[0]?.email_address || '',
            firstName: evt.data.first_name || '',
            lastName: evt.data.last_name || '',
          }
        })
        console.log('User updated in database')
        break

      case 'user.deleted':
        // Delete user from database
        await prisma.user.delete({
          where: { clerkUserId: evt.data.id }
        })
        console.log('User deleted from database')
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }
  } catch (error) {
    console.error('Database error:', error)
    return new Response('Database error', { status: 500 })
  }

  return new Response('', { status: 200 })
}
