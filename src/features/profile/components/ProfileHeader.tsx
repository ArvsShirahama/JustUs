import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { ProfileWithCounts } from '@/services/supabase/profiles'
import { getFollowers, getFollowing } from '@/services/supabase/profiles'
import { FollowButton } from './FollowButton'
import { FollowList } from './FollowList'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { ROUTES } from '@/lib/constants'

interface ProfileHeaderProps {
  profile: ProfileWithCounts
}

type FollowListType = 'followers' | 'following'

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.user)
  const { mutate: doLogout } = useLogout()
  const [followListType, setFollowListType] = useState<FollowListType | null>(null)
  const isOwn = currentUser?.id === profile.id

  const { data: followers, isLoading: followersLoading } = useQuery({
    queryKey: ['followers', profile.id],
    queryFn: () => getFollowers(profile.id),
    enabled: followListType === 'followers',
  })

  const { data: following, isLoading: followingLoading } = useQuery({
    queryKey: ['following', profile.id],
    queryFn: () => getFollowing(profile.id),
    enabled: followListType === 'following',
  })

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="h-20 w-20 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[hsl(var(--muted-foreground))]">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-[hsl(var(--foreground))] truncate">
                {profile.display_name}
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                @{profile.username}
              </p>
            </div>

            {isOwn && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => doLogout()}
                  className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                  title={t('auth.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="mt-2 text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-[hsl(var(--primary))] hover:underline"
            >
              {profile.website}
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="text-center">
          <span className="block font-bold text-[hsl(var(--foreground))]">
            {profile.posts_count ?? 0}
          </span>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('profile.posts')}
          </span>
        </div>
        <button className="text-center hover:opacity-80" onClick={() => setFollowListType('followers')}>
          <span className="block font-bold text-[hsl(var(--foreground))]">
            {profile.followers_count ?? 0}
          </span>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('profile.followers')}
          </span>
        </button>
        <button className="text-center hover:opacity-80" onClick={() => setFollowListType('following')}>
          <span className="block font-bold text-[hsl(var(--foreground))]">
            {profile.following_count ?? 0}
          </span>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('profile.following')}
          </span>
        </button>
      </div>

      {isOwn ? (
        <Link
          to={ROUTES.editProfile}
          className="mt-4 block w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-1.5 text-sm font-medium text-[hsl(var(--foreground))] text-center hover:bg-[hsl(var(--muted))] transition-colors"
        >
          {t('profile.editProfile')}
        </Link>
      ) : (
        <div className="mt-4">
          <FollowButton
            profileId={profile.id}
            username={profile.username}
            isFollowing={profile.is_following ?? false}
          />
        </div>
      )}

      {followListType === 'followers' && (
        <FollowList
          users={followers ?? []}
          title={t('profile.followers')}
          isLoading={followersLoading}
          onClose={() => setFollowListType(null)}
        />
      )}
      {followListType === 'following' && (
        <FollowList
          users={following ?? []}
          title={t('profile.following')}
          isLoading={followingLoading}
          onClose={() => setFollowListType(null)}
        />
      )}
    </div>
  )
}
