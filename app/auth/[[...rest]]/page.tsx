"use client"

import { motion } from "framer-motion"
import { SignIn, SignUp } from "@clerk/nextjs"
import BackgroundPaths from "@/components/background-paths"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'sign-in'

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white dark:bg-neutral-950 overflow-hidden">
      {/* floating animated SVGs */}
      <BackgroundPaths />

      {/* container fades-in nicely */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80 text-transparent bg-clip-text"
          >
            Ultimate Setup
          </Link>
          <p className="text-muted-foreground mt-2">
            {mode === 'sign-up' ? 'Créez votre compte' : 'Connectez-vous à votre compte'}
          </p>
        </div>

        {/* Clerk Auth Component */}
        <div className="shadow-lg backdrop-blur-md/10 border border-white/10 dark:border-white/20 rounded-lg bg-white/80 dark:bg-neutral-900/80 p-6">
          {mode === 'sign-up' ? (
            <SignUp 
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden"
                }
              }}
              afterSignUpUrl="/"
              signInUrl="/auth"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent p-0",
                  headerTitle: "hidden", 
                  headerSubtitle: "hidden"
                }
              }}
              afterSignInUrl="/"
              signUpUrl="/auth?mode=sign-up"
            />
          )}
        </div>

        {/* Demo alert */}
        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Environnement de développement&nbsp;:</strong> Utilisez des identifiants de test pour vous connecter.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  )
}
