import { useMutation } from '@tanstack/react-query'
import { logout } from '@/services/supabase/auth'
import { useAuthStore } from '../stores/auth.store'

export function useLogout() {
  const reset = useAuthStore((s) => s.reset)

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset()
    },
  })
}
