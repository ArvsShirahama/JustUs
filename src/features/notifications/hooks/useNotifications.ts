import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/services/supabase/notifications'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useNotificationsStore } from '../stores/notifications.store'
import { useEffect } from 'react'

export function useNotifications() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const setUnreadCount = useNotificationsStore((s) => s.setUnreadCount)

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return getNotifications(user.id)
    },
    enabled: !!user,
  })

  const unreadQuery = useQuery({
    queryKey: ['notifications-unread', user?.id],
    queryFn: () => {
      if (!user) return 0
      return getUnreadCount(user.id)
    },
    enabled: !!user,
    refetchInterval: 30000,
  })

  useEffect(() => {
    if (unreadQuery.data !== undefined) {
      setUnreadCount(unreadQuery.data)
    }
  }, [unreadQuery.data, setUnreadCount])

  const markRead = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })

  const markAllRead = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not authenticated')
      return markAllAsRead(user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })

  return {
    notifications: notificationsQuery.data ?? [],
    isLoading: notificationsQuery.isLoading,
    unreadCount: unreadQuery.data ?? 0,
    markRead,
    markAllRead,
  }
}
