import { create } from 'zustand'
import type { NotificationWithActor } from '@/services/supabase/notifications'

interface NotificationsStore {
  unreadCount: number
  setUnreadCount: (count: number) => void
  decrementUnread: () => void
  resetUnread: () => void
  recentNotification: NotificationWithActor | null
  setRecentNotification: (notification: NotificationWithActor | null) => void
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  resetUnread: () => set({ unreadCount: 0 }),
  recentNotification: null,
  setRecentNotification: (notification) =>
    set({ recentNotification: notification }),
}))
