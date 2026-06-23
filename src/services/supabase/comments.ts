import { supabase } from './client'
import type { Comment } from '@/types/database.types'

export interface CommentWithUser extends Comment {
  profiles: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export async function getComments(postId: string): Promise<CommentWithUser[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
      *,
      profiles!user_id(id, username, display_name, avatar_url)
    `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as unknown as CommentWithUser[]
}

export async function createComment(
  userId: string,
  postId: string,
  content: string
): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from('comments')
    .insert({ user_id: userId, post_id: postId, content })
    .select(
      `
      *,
      profiles!user_id(id, username, display_name, avatar_url)
    `
    )
    .single()

  if (error) throw error
  return data as unknown as CommentWithUser
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
  if (error) throw error
}
