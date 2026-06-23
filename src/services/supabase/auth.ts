import { supabase } from './client'
import type { AuthUser, LoginInput, SignupInput } from '@/types/auth.types'

export async function signup(input: SignupInput): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        username: input.username,
        display_name: input.displayName,
      },
    },
  })

  if (error) throw error
  if (!data.user) throw new Error('Signup failed')

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username: input.username,
    display_name: input.displayName,
  })

  if (profileError) throw profileError

  return mapUser(data.user)
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) throw error
  if (!data.user) throw new Error('Login failed')

  return mapUser(data.user)
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return mapUser(data.user)
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
}

function mapUser(user: import('@supabase/supabase-js').User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    username: user.user_metadata?.username ?? '',
    displayName: user.user_metadata?.display_name ?? '',
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    bio: user.user_metadata?.bio ?? null,
    isVerified: user.user_metadata?.is_verified ?? false,
  }
}
