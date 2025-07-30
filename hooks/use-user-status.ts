"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface UserStatus {
  isLoading: boolean
  isSignedIn: boolean
  existsInDB: boolean
  needsOnboarding: boolean
  user: any
}

export function useUserStatus(): UserStatus {
  const { isLoaded, isSignedIn, user } = useUser()
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isLoading: true,
    isSignedIn: false,
    existsInDB: false,
    needsOnboarding: false,
    user: null
  })

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!isLoaded) return

      if (!isSignedIn || !user) {
        setUserStatus({
          isLoading: false,
          isSignedIn: false,
          existsInDB: false,
          needsOnboarding: false,
          user: null
        })
        return
      }

      try {
        // Vérifier si l'utilisateur existe en base
        const response = await fetch('/api/users/create')
        const data = await response.json()

        if (data.exists) {
          setUserStatus({
            isLoading: false,
            isSignedIn: true,
            existsInDB: true,
            needsOnboarding: false,
            user: data.user
          })
        } else {
          // L'utilisateur est connecté via Clerk mais pas en base
          setUserStatus({
            isLoading: false,
            isSignedIn: true,
            existsInDB: false,
            needsOnboarding: true,
            user: null
          })
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut utilisateur:', error)
        setUserStatus({
          isLoading: false,
          isSignedIn: true,
          existsInDB: false,
          needsOnboarding: true,
          user: null
        })
      }
    }

    checkUserStatus()
  }, [isLoaded, isSignedIn, user])

  return userStatus
}

export async function createUserInDB(userData: {
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
}) {
  try {
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'utilisateur')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur createUserInDB:', error)
    throw error
  }
}
