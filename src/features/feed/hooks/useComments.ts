import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getComments,
  createComment,
  deleteComment,
} from '@/services/supabase/comments'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useComments(postId: string) {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  })

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Not authenticated')
      return createComment(user.id, postId, content)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })

  const removeComment = useMutation({
    mutationFn: async (commentId: string) => {
      return deleteComment(commentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    addComment,
    removeComment,
  }
}
