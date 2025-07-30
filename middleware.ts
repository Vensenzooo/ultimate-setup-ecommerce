import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/client(.*)',
  '/profile(.*)',
  '/orders(.*)',
  '/billing(.*)',
  '/settings(.*)'
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth(.*)',
  '/catalog(.*)',
  '/compare(.*)', 
  '/configurator(.*)',
  '/guest(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Ne protéger que les routes explicitement définies comme protégées
  // et seulement si ce ne sont pas des routes publiques
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    try {
      await auth.protect()
    } catch (error) {
      // En développement, log l'erreur mais continue
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Auth protection failed:', error)
        // Rediriger vers la page d'auth au lieu de faire échouer
        return Response.redirect(new URL('/auth', req.url))
      }
      throw error
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
