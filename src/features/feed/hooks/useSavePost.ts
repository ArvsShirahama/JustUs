import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleSavePost } from '@/services/supabase/posts'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useSavePost() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      postId,
      hasSaved,
    }: {
      postId: string
      hasSaved: boolean
    }) => {
      if (!user) throw new Error('Not authenticated')
      await toggleSavePost(user.id, postId, hasSaved)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}
