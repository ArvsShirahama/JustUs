import { useMutation } from '@tanstack/react-query'
import { signup } from '@/services/supabase/auth'
import type { SignupInput } from '@/types/auth.types'

export function useSignup() {
  return useMutation({
    mutationFn: (input: SignupInput) => signup(input),
  })
}
