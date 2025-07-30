import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ultimate Setup - Configurateur PC",
  description: "Créez votre configuration PC parfaite avec notre configurateur intelligent",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
