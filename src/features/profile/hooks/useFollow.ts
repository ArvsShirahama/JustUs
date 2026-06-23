import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followUser, unfollowUser } from '@/services/supabase/profiles'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useFollow(username: string) {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((s) => s.user)

  const follow = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!currentUser) throw new Error('Not authenticated')
      await followUser(currentUser.id, targetUserId)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['profile', username] })
      const previous = queryClient.getQueryData(['profile', username])

      queryClient.setQueryData(['profile', username], (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const profile = old as Record<string, unknown>
        return {
          ...profile,
          is_following: true,
          followers_count: ((profile.followers_count as number) ?? 0) + 1,
        }
      })

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['profile', username], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
    },
  })

  const unfollow = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!currentUser) throw new Error('Not authenticated')
      await unfollowUser(currentUser.id, targetUserId)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['profile', username] })
      const previous = queryClient.getQueryData(['profile', username])

      queryClient.setQueryData(['profile', username], (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const profile = old as Record<string, unknown>
        return {
          ...profile,
          is_following: false,
          followers_count: Math.max(
            0,
            ((profile.followers_count as number) ?? 1) - 1
          ),
        }
      })

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['profile', username], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
    },
  })

  return { follow, unfollow }
}
