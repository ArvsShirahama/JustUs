import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/supabase/auth'
import { useAuthStore } from '../stores/auth.store'
import type { LoginInput } from '@/types/auth.types'

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (user) => {
      setUser(user)
    },
  })
}
