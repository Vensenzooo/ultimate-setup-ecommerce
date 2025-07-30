import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ConditionalClerkProviderProps {
  children: ReactNode
}

export function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  // Vérifier si les clés Clerk sont configurées
  const hasClerkKeys = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.CLERK_SECRET_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_dGVzdA') // Éviter les fausses clés

  if (hasClerkKeys) {
    return <ClerkProvider>{children}</ClerkProvider>
  }

  // Mode développement sans Clerk
  return <>{children}</>
}
