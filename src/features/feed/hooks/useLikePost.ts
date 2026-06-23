import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost, unlikePost } from '@/services/supabase/likes'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useLikePost() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const toggleLike = useMutation({
    mutationFn: async ({
      postId,
      hasLiked,
    }: {
      postId: string
      hasLiked: boolean
    }) => {
      if (!user) throw new Error('Not authenticated')
      if (hasLiked) {
        await unlikePost(user.id, postId)
      } else {
        await likePost(user.id, postId)
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feed'] })
      await queryClient.cancelQueries({ queryKey: ['explore'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })

  return toggleLike
}
