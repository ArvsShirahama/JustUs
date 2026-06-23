import { useQuery } from '@tanstack/react-query'
import { getCallHistory } from '@/services/supabase/calls'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useCallHistory() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['call-history', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return getCallHistory(user.id)
    },
    enabled: !!user,
  })
}
