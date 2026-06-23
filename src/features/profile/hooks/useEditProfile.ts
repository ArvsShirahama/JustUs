import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile, uploadAvatar } from '@/services/supabase/profiles'
import { compressImage } from '@/services/compression/media'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { Profile } from '@/types/database.types'

export function useEditProfile() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const updateMutation = useMutation({
    mutationFn: async (
      data: Partial<Pick<Profile, 'display_name' | 'bio' | 'website'>>
    ) => {
      if (!user) throw new Error('Not authenticated')
      await updateProfile(user.id, data)
      return data
    },
    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, ...data })
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated')
      const compressed = await compressImage(file)
      const url = await uploadAvatar(user.id, compressed)
      await updateProfile(user.id, { avatar_url: url })
      return url
    },
    onSuccess: (url) => {
      if (user) {
        setUser({ ...user, avatarUrl: url })
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return {
    updateProfile: updateMutation,
    uploadAvatar: avatarMutation,
    isPending: updateMutation.isPending || avatarMutation.isPending,
  }
}
