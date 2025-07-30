"use client"

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  link?: string
  icon?: string
}

export function useNotifications() {
  const { isSignedIn, user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Charger les notifications depuis l'API
  const loadNotifications = useCallback(async () => {
    if (!isSignedIn) {
      // Pour les utilisateurs non connectés, afficher des notifications génériques
      const guestNotifications: Notification[] = [
        {
          id: 'welcome',
          type: 'info',
          title: 'Bienvenue sur Ultimate Setup !',
          message: 'Créez un compte pour sauvegarder vos configurations et favoris',
          isRead: false,
          createdAt: new Date(),
          link: '/auth'
        },
        {
          id: 'promo',
          type: 'promotion',
          title: 'Offre spéciale',
          message: 'Jusqu\'à -30% sur une sélection de composants gaming ce mois-ci !',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
          link: '/catalog'
        },
        {
          id: 'configurator',
          type: 'success',
          title: 'Configurateur amélioré',
          message: 'Découvrez notre nouveau configurateur avec suggestions intelligentes',
          isRead: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
          link: '/configurator'
        }
      ]
      setNotifications(guestNotifications)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn])

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!isSignedIn) {
      // Pour les invités, juste mettre à jour localement
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      return
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        )
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error)
    }
  }, [isSignedIn])

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!isSignedIn) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      return
    }

    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        )
        
        toast({
          title: "Notifications lues",
          description: "Toutes les notifications ont été marquées comme lues",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer les notifications comme lues",
        variant: "destructive",
      })
    }
  }, [isSignedIn, toast])

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!isSignedIn) {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      return
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        
        toast({
          title: "Notification supprimée",
          description: "La notification a été supprimée",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive",
      })
    }
  }, [isSignedIn, toast])

  // Créer une nouvelle notification (pour les administrateurs)
  const createNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    if (!isSignedIn) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      })

      if (response.ok) {
        const newNotification = await response.json()
        setNotifications(prev => [newNotification, ...prev])
        
        toast({
          title: "Notification créée",
          description: "La notification a été créée avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la notification",
        variant: "destructive",
      })
    }
  }, [isSignedIn, toast])

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const unreadCount = notifications.filter(notif => !notif.isRead).length

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    loadNotifications,
  }
}
