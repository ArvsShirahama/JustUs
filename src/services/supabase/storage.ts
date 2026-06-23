import { supabase } from './client'

export async function uploadFile(
  bucket: 'avatars' | 'post-media' | 'message-media',
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(
  bucket: 'avatars' | 'post-media' | 'message-media',
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
