import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useEditProfile } from '../hooks/useEditProfile'
import { AvatarUpload } from '../components/AvatarUpload'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { ROUTES } from '@/lib/constants'

const editProfileSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be at most 50 characters'),
  bio: z.string().max(150, 'Bio must be at most 150 characters').optional(),
  website: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
})

type EditProfileFormData = z.infer<typeof editProfileSchema>

export default function EditProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { updateProfile, isPending } = useEditProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      display_name: user?.displayName ?? '',
      bio: user?.bio ?? '',
      website: '',
    },
  })

  const onSubmit = (data: EditProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.profile(user?.username ?? ''))
      },
    })
  }

  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[hsl(var(--border))]">
        <Link
          to={ROUTES.profile(user?.username ?? '')}
          className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </Link>
        <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">
          {t('profile.editProfile')}
        </h1>
      </div>

      <div className="px-4 pt-6">
        <AvatarUpload
          currentUrl={user?.avatarUrl ?? null}
          displayName={user?.displayName ?? ''}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              {t('auth.displayName')}
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              {...register('display_name')}
            />
            {errors.display_name && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.display_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              {t('profile.bio')}
            </label>
            <textarea
              rows={3}
              className="flex w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Website
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              {...register('website')}
            />
            {errors.website && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.website.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[#0284C7] disabled:opacity-50 transition-colors"
          >
            {isPending ? t('common.loading') : t('common.save')}
          </button>
        </form>
      </div>
    </div>
  )
}
