import { clerkMiddleware } from '@clerk/nextjs/server'

// Middleware temporaire simplifié - aucune protection pour tester les clés
export default clerkMiddleware(async (auth, req) => {
  // Ne rien faire pour l'instant, juste laisser Clerk s'initialiser
  console.log('🔐 Clerk middleware called for:', req.url)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
