import { create } from 'zustand'
import type { Profile } from '@/types/database.types'

interface SettingsStore {
  isPrivate: boolean
  notificationPreferences: Record<string, boolean>
  language: string
  blockedUsers: Profile[]

  setIsPrivate: (isPrivate: boolean) => void
  setNotificationPreferences: (prefs: Record<string, boolean>) => void
  setLanguage: (language: string) => void
  setBlockedUsers: (users: Profile[]) => void
  removeBlockedUser: (userId: string) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  isPrivate: false,
  notificationPreferences: {
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    calls: true,
  },
  language: 'en',
  blockedUsers: [],

  setIsPrivate: (isPrivate) => set({ isPrivate }),
  setNotificationPreferences: (prefs) => set({ notificationPreferences: prefs }),
  setLanguage: (language) => set({ language }),
  setBlockedUsers: (users) => set({ blockedUsers: users }),
  removeBlockedUser: (userId) =>
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((u) => u.id !== userId),
    })),
}))
