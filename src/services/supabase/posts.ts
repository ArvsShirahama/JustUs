import { supabase } from './client'
import { uploadFile } from './storage'
import type { Post } from '@/types/database.types'

function extractCount(val: unknown): number {
  if (Array.isArray(val) && val.length > 0) {
    const first = val[0] as Record<string, unknown>
    return typeof first.count === 'number' ? first.count : 0
  }
  return 0
}

export interface PostWithDetails extends Post {
  profiles: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
  likes_count: number
  comments_count: number
  has_liked: boolean
  has_saved: boolean
}

export async function createPost(
  userId: string,
  caption: string | null,
  files: File[]
): Promise<Post> {
  const hashtags = extractHashtags(caption ?? '')

  const mediaUrls: string[] = []
  const mediaTypes: string[] = []

  for (const file of files) {
    const path = `${userId}/${crypto.randomUUID()}.${file.name.split('.').pop()}`
    const url = await uploadFile('post-media', path, file)
    mediaUrls.push(url)
    mediaTypes.push(file.type.startsWith('video/') ? 'video' : 'image')
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      caption,
      media_urls: mediaUrls,
      media_types: mediaTypes,
      hashtags,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getFeedPosts(
  userId: string,
  page: number,
  pageSize = 10
): Promise<PostWithDetails[]> {
  const { data: followingIds } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId)

  const userIds = [
    userId,
    ...(followingIds?.map((f) => f.following_id) ?? []),
  ]

  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles!user_id(id, username, display_name, avatar_url),
      likes_count: likes(count),
      comments_count: comments(count)
    `
    )
    .in('user_id', userIds)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  const rawPosts = data as unknown as PostWithDetails[]
  const posts = rawPosts.map((p) => ({
    ...p,
    likes_count: extractCount((p as unknown as Record<string, unknown>).likes_count),
    comments_count: extractCount((p as unknown as Record<string, unknown>).comments_count),
  }))

  // Check likes and saves for current user
  const postIds = posts.map((p) => p.id)

  const { data: likedData } = await supabase
    .from('likes')
    .select('post_id')
    .in('post_id', postIds)
    .eq('user_id', userId)

  const likedIds = new Set(likedData?.map((l) => l.post_id) ?? [])

  const { data: savedData } = await supabase
    .from('saved_posts')
    .select('post_id')
    .in('post_id', postIds)
    .eq('user_id', userId)

  const savedIds = new Set(savedData?.map((s) => s.post_id) ?? [])

  return posts.map((post) => ({
    ...post,
    has_liked: likedIds.has(post.id),
    has_saved: savedIds.has(post.id),
  }))
}

export async function getExplorePosts(
  _userId: string,
  page: number,
  pageSize = 10
): Promise<PostWithDetails[]> {
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles!user_id(id, username, display_name, avatar_url),
      likes_count: likes(count),
      comments_count: comments(count)
    `
    )
    .order('likes_count', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (error) throw error
  const rawPosts = data as unknown as PostWithDetails[]
  return rawPosts.map((p) => ({
    ...p,
    likes_count: extractCount((p as unknown as Record<string, unknown>).likes_count),
    comments_count: extractCount((p as unknown as Record<string, unknown>).comments_count),
  }))
}

export async function getUserPosts(
  profileUserId: string,
  currentUserId?: string
): Promise<PostWithDetails[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles!user_id(id, username, display_name, avatar_url),
      likes_count: likes(count),
      comments_count: comments(count)
    `
    )
    .eq('user_id', profileUserId)
    .order('created_at', { ascending: false })

  if (error) throw error

  const rawPosts = data as unknown as PostWithDetails[]
  const posts = rawPosts.map((p) => ({
    ...p,
    likes_count: extractCount((p as unknown as Record<string, unknown>).likes_count),
    comments_count: extractCount((p as unknown as Record<string, unknown>).comments_count),
  }))

  if (currentUserId) {
    const postIds = posts.map((p) => p.id)

    const { data: likedData } = await supabase
      .from('likes')
      .select('post_id')
      .in('post_id', postIds)
      .eq('user_id', currentUserId)

    const likedIds = new Set(likedData?.map((l) => l.post_id) ?? [])

    return posts.map((post) => ({
      ...post,
      has_liked: likedIds.has(post.id),
      has_saved: false,
    }))
  }

  return posts.map((post) => ({ ...post, has_liked: false, has_saved: false }))
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw error
}

export async function toggleSavePost(
  userId: string,
  postId: string,
  saved: boolean
): Promise<void> {
  if (saved) {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('saved_posts')
      .insert({ user_id: userId, post_id: postId })
    if (error) throw error
  }
}

export function extractHashtags(caption: string): string[] {
  const matches = caption.match(/#\w+/g)
  if (!matches) return []
  return matches.map((tag) => tag.toLowerCase().slice(1))
}
