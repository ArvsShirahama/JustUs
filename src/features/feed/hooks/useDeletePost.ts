import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '@/services/supabase/posts'

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
