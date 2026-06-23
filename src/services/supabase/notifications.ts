import { supabase } from './client'
import type { Notification } from '@/types/database.types'

export interface NotificationWithActor extends Notification {
  actor: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export async function getNotifications(
  userId: string
): Promise<NotificationWithActor[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
      *,
      actor:actor_id(id, username, display_name, avatar_url)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data as unknown as NotificationWithActor[]
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) return 0
  return count ?? 0
}

export async function markAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  if (error) throw error
}

export async function markAllAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
}

export function subscribeToNotifications(
  userId: string,
  callback: (notification: NotificationWithActor) => void
) {
  return supabase
    .channel(`notifications:${userId}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const notification = payload.new as NotificationWithActor
        callback(notification)
      }
    )
    .subscribe()
}
