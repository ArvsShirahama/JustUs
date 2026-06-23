import { create } from 'zustand'
import type { ProfileWithCounts } from '@/services/supabase/profiles'

interface ProfileStore {
  profile: ProfileWithCounts | null
  isLoading: boolean
  setProfile: (profile: ProfileWithCounts | null) => void
  setLoading: (isLoading: boolean) => void
  updateProfileField: <K extends keyof ProfileWithCounts>(
    key: K,
    value: ProfileWithCounts[K]
  ) => void
  reset: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  updateProfileField: (key, value) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, [key]: value }
        : null,
    })),
  reset: () => set({ profile: null, isLoading: true }),
}))
