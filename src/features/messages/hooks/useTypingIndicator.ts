import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/services/supabase/client'
import {
  subscribeToTyping,
  emitTyping,
} from '@/services/supabase/messages'
import { useMessagesStore } from '../stores/messages.store'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useTypingIndicator(conversationId: string) {
  const user = useAuthStore((s) => s.user)
  const addTypingUser = useMessagesStore((s) => s.addTypingUser)
  const removeTypingUser = useMessagesStore((s) => s.removeTypingUser)
  const typingUsers = useMessagesStore((s) => s.typingUsers[conversationId] ?? [])
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!conversationId || !user) return

    const subscription = subscribeToTyping(
      conversationId,
      user.id,
      (typingUserId) => {
        addTypingUser(conversationId, typingUserId)

        setTimeout(() => {
          removeTypingUser(conversationId, typingUserId)
        }, 3000)
      }
    )

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [conversationId, user, addTypingUser, removeTypingUser])

  const emit = useCallback(() => {
    if (!conversationId || !user) return

    emitTyping(conversationId, user.id)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null
    }, 2000)
  }, [conversationId, user])

  return { typingUsers, emitTyping: emit }
}
