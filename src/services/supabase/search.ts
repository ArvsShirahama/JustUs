import { supabase } from './client'
import type { Profile, Post } from '@/types/database.types'

export interface SearchPostResult extends Post {
  profiles: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
  likes_count: number
}

export async function searchUsers(
  query: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(
      `username.ilike.%${query}%,display_name.ilike.%${query}%`
    )
    .limit(20)

  if (error) throw error
  return data ?? []
}

export async function searchPosts(query: string): Promise<SearchPostResult[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles!user_id(id, username, display_name, avatar_url),
      likes_count: likes(count)
    `
    )
    .ilike('caption', `%${query}%`)
    .order('likes_count', { ascending: false, nullsFirst: false })
    .limit(20)

  if (error) throw error
  return data as unknown as SearchPostResult[]
}

export async function searchHashtags(
  hashtag: string
): Promise<{ hashtag: string; post_count: number }[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('hashtags')
    .contains('hashtags', [hashtag.toLowerCase()])
    .limit(50)

  if (error) throw error

  const tagCounts = new Map<string, number>()
  data?.forEach((post) => {
    post.hashtags?.forEach((tag: string) => {
      if (tag.toLowerCase().includes(hashtag.toLowerCase())) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
    })
  })

  return Array.from(tagCounts.entries())
    .map(([hashtag, post_count]) => ({ hashtag, post_count }))
    .sort((a, b) => b.post_count - a.post_count)
    .slice(0, 10)
}

export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem('recent-searches')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addRecentSearch(query: string): void {
  const searches = getRecentSearches().filter(
    (s) => s.toLowerCase() !== query.toLowerCase()
  )
  searches.unshift(query)
  localStorage.setItem('recent-searches', JSON.stringify(searches.slice(0, 10)))
}

export function clearRecentSearches(): void {
  localStorage.removeItem('recent-searches')
}
