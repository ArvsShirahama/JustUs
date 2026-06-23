import { supabase } from './client'

export async function likePost(userId: string, postId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .insert({ user_id: userId, post_id: postId })
  if (error && error.code !== '23505') throw error // ignore duplicate
}

export async function unlikePost(
  userId: string,
  postId: string
): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId)
  if (error) throw error
}
