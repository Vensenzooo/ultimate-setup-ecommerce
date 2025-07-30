"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

interface ConditionalClerkProviderProps {
  children: ReactNode
}

export function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  const hasValidClerkKeys = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')

  if (!hasValidClerkKeys) {
    // En développement sans clés valides, on retourne juste les enfants
    console.warn('⚠️ Clerk keys not configured. Using fallback mode.')
    return <>{children}</>
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}
