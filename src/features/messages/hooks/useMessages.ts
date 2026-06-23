import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  getMessages,
  markAsSeen,
  updateLastRead,
  subscribeToConversation,
} from '@/services/supabase/messages'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { MessageWithSender } from '@/services/supabase/messages'

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  })

  useEffect(() => {
    if (!conversationId || !user) return

    const subscription = subscribeToConversation(conversationId, (message) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: MessageWithSender[] | undefined) => {
          if (!old) return [message]
          if (old.some((m) => m.id === message.id)) return old
          return [...old, message]
        }
      )
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId, user, queryClient])

  useEffect(() => {
    if (!conversationId || !user) return
    const messages = query.data ?? []
    const unseenIds = messages
      .filter((m) => m.sender_id !== user.id && m.status !== 'seen')
      .map((m) => m.id)

    if (unseenIds.length > 0) {
      markAsSeen(unseenIds)
      updateLastRead(user.id, conversationId)
    }
  }, [conversationId, user, query.data])

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
  }
}
