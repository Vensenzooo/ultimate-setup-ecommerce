"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function useUserSync() {
  const { isSignedIn, user } = useUser()
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSynced, setIsSynced] = useState(false)
  const { toast } = useToast()

  const syncUser = async () => {
    if (!isSignedIn || isSyncing || isSynced) return

    setIsSyncing(true)
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (response.ok) {
        setIsSynced(true)
        toast({
          title: 'Profil synchronisé avec succès!',
          description: 'Vous pouvez maintenant utiliser toutes les fonctionnalités'
        })
        
        // Déclencher un événement pour que d'autres composants sachent que la sync est terminée
        window.dispatchEvent(new CustomEvent('userSynced'))
      } else {
        // Si utilisateur déjà synchronisé
        if (data.message?.includes('déjà synchronisé')) {
          setIsSynced(true)
        } else {
          toast({
            title: 'Erreur de synchronisation',
            description: data.error || 'Veuillez réessayer',
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Impossible de synchroniser le profil',
        variant: "destructive"
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Auto-sync après connexion
  useEffect(() => {
    if (isSignedIn && user && !isSynced && !isSyncing) {
      // Petit délai pour s'assurer que l'auth est complètement initialisée
      const timer = setTimeout(() => {
        syncUser()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isSignedIn, user])

  // Vérifier si l'utilisateur est déjà synchronisé au chargement
  useEffect(() => {
    const checkSyncStatus = async () => {
      if (!isSignedIn || isSynced) return

      try {
        const response = await fetch('/api/cart')
        if (response.ok) {
          // Si l'API cart fonctionne, l'utilisateur est synchronisé
          setIsSynced(true)
        }
      } catch (error) {
        // Ignore les erreurs, on laisse l'auto-sync s'occuper de la création
      }
    }

    if (isSignedIn && user) {
      checkSyncStatus()
    }
  }, [isSignedIn, user])

  return {
    syncUser,
    isSyncing,
    isSynced,
    needsSync: isSignedIn && !isSynced
  }
}
