import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/services/supabase/posts'
import { compressImage } from '@/services/compression/media'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useCreatePost() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      caption,
      files,
    }: {
      caption: string
      files: File[]
    }) => {
      if (!user) throw new Error('Not authenticated')

      const compressed = await Promise.all(
        files.map((f) => compressImage(f))
      )

      return createPost(user.id, caption || null, compressed)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
