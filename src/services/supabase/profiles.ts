import { supabase } from './client'
import type { Profile } from '@/types/database.types'

export type ProfileWithCounts = Profile & {
  posts_count: number
  followers_count: number
  following_count: number
  is_following?: boolean
  is_follower?: boolean
}

function extractCount(val: unknown): number {
  if (Array.isArray(val) && val.length > 0) {
    const first = val[0] as Record<string, unknown>
    return typeof first.count === 'number' ? first.count : 0
  }
  return 0
}

export async function getProfile(
  username: string
): Promise<ProfileWithCounts | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      posts_count: posts(count),
      followers_count: follows!following_id(count),
      following_count: follows!follower_id(count)
    `
    )
    .eq('username', username)
    .single()

  if (error) return null
  if (!profile) return null

  return {
    ...profile,
    posts_count: extractCount((profile as Record<string, unknown>).posts_count),
    followers_count: extractCount((profile as Record<string, unknown>).followers_count),
    following_count: extractCount((profile as Record<string, unknown>).following_count),
  } as ProfileWithCounts
}

export async function getProfileById(
  userId: string
): Promise<ProfileWithCounts | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      posts_count: posts(count),
      followers_count: follows!following_id(count),
      following_count: follows!follower_id(count)
    `
    )
    .eq('id', userId)
    .single()

  if (error) return null
  return {
    ...profile,
    posts_count: extractCount((profile as Record<string, unknown>).posts_count),
    followers_count: extractCount((profile as Record<string, unknown>).followers_count),
    following_count: extractCount((profile as Record<string, unknown>).following_count),
  } as ProfileWithCounts
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'website' | 'avatar_url'>>
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function followUser(
  followerId: string,
  followingId: string
): Promise<void> {
  const { error } = await supabase.from('follows').insert({
    follower_id: followerId,
    following_id: followingId,
  })
  if (error) throw error
}

export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
  if (error) throw error
}

export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle()

  if (error) return false
  return data !== null
}

export async function getFollowers(
  userId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id, profiles!follower_id(*)')
    .eq('following_id', userId)

  if (error) return []
  return data
    .map((item) => item.profiles as unknown as Profile)
    .filter(Boolean)
}

export async function getFollowing(
  userId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('following_id, profiles!following_id(*)')
    .eq('follower_id', userId)

  if (error) return []
  return data
    .map((item) => item.profiles as unknown as Profile)
    .filter(Boolean)
}
