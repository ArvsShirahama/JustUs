import { useEffect } from 'react'
import { supabase } from '@/services/supabase/client'
import { subscribeToNotifications } from '@/services/supabase/notifications'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useNotificationsStore } from '../stores/notifications.store'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeNotifications() {
  const user = useAuthStore((s) => s.user)
  const incrementUnread = useNotificationsStore((s) => s.setUnreadCount)
  const unreadCount = useNotificationsStore((s) => s.unreadCount)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const subscription = subscribeToNotifications(user.id, () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      incrementUnread(unreadCount + 1)
    })

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, queryClient, incrementUnread, unreadCount])
}
