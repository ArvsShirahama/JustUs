import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Settings } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileTabs } from '../components/ProfileTabs'
import { ProfileGrid } from '../components/ProfileGrid'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { ROUTES } from '@/lib/constants'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { username } = useParams<{ username: string }>()
  const currentUser = useAuthStore((s) => s.user)
  const { data: profile, isLoading, error } = useProfile(username ?? '')
  const [tab, setTab] = useState<'posts' | 'saved'>('posts')

  const isOwn = currentUser?.username === username

  if (isLoading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          User not found
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          This account doesn't exist
        </p>
        <Link
          to={ROUTES.feed}
          className="mt-4 text-sm text-[hsl(var(--primary))] hover:underline"
        >
          Go back to feed
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-3">
        <Link to={ROUTES.feed} className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors">
          <ArrowLeft className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">
            {profile.display_name}
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {profile.posts_count ?? 0} {t('profile.posts')}
          </p>
        </div>
        {isOwn && (
          <Link
            to={ROUTES.editProfile}
            className="ml-auto rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>
        )}
      </div>

      <ProfileHeader profile={profile} />
      <ProfileTabs
        activeTab={tab}
        onTabChange={setTab}
        isOwn={isOwn}
      />
      <ProfileGrid
        posts={[]}
        isLoading={false}
      />
    </div>
  )
}
