import { supabase } from './client'
import type { Profile } from '@/types/database.types'

export async function blockUser(
  blockerId: string,
  blockedId: string
): Promise<void> {
  const { error } = await supabase.from('blocked_users').insert({
    blocker_id: blockerId,
    blocked_id: blockedId,
  })
  if (error && error.code !== '23505') throw error
}

export async function unblockUser(
  blockerId: string,
  blockedId: string
): Promise<void> {
  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
  if (error) throw error
}

export async function getBlockedUsers(
  userId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('blocked_users')
    .select('blocked_id, profiles!blocked_id(*)')
    .eq('blocker_id', userId)

  if (error) throw error
  return data
    .map((item) => item.profiles as unknown as Profile)
    .filter(Boolean)
}

export async function isBlocked(
  blockerId: string,
  blockedId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('blocked_users')
    .select('id')
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
    .maybeSingle()

  if (error) return false
  return data !== null
}
