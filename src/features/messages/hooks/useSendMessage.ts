import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '@/services/supabase/messages'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      content,
      file,
    }: {
      content?: string
      file?: File
    }) => {
      if (!user) throw new Error('Not authenticated')
      return sendMessage(user.id, conversationId, content ?? null, file)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
