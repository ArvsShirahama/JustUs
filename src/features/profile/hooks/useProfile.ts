import { useQuery } from '@tanstack/react-query'
import { getProfile, getProfileById, isFollowing } from '@/services/supabase/profiles'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useProfile(username: string) {
  const currentUser = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const profile = await getProfile(username)
      if (!profile) return null

      if (currentUser && currentUser.id !== profile.id) {
        profile.is_following = await isFollowing(currentUser.id, profile.id)
        profile.is_follower = await isFollowing(profile.id, currentUser.id)
      }

      return profile
    },
  })
}

export function useProfileById(userId: string | undefined) {
  const currentUser = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      const profile = await getProfileById(userId)
      if (!profile) return null

      if (currentUser && currentUser.id !== profile.id) {
        profile.is_following = await isFollowing(currentUser.id, profile.id)
      }

      return profile
    },
    enabled: !!userId,
  })
}
