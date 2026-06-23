import { useQuery } from '@tanstack/react-query'
import { getConversations } from '@/services/supabase/messages'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useConversations() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return getConversations(user.id)
    },
    enabled: !!user,
    refetchInterval: 10000,
  })
}
