import { useTranslation } from 'react-i18next'
import { useFollow } from '../hooks/useFollow'

interface FollowButtonProps {
  profileId: string
  username: string
  isFollowing: boolean
}

export function FollowButton({
  profileId,
  username,
  isFollowing,
}: FollowButtonProps) {
  const { t } = useTranslation()
  const { follow, unfollow } = useFollow(username)

  if (isFollowing) {
    return (
      <button
        onClick={() => unfollow.mutate(profileId)}
        disabled={unfollow.isPending}
        className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-1.5 text-sm font-medium text-[hsl(var(--foreground))] hover:border-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))] transition-colors disabled:opacity-50"
      >
        {unfollow.isPending ? t('common.loading') : t('profile.following')}
      </button>
    )
  }

  return (
    <button
      onClick={() => follow.mutate(profileId)}
      disabled={follow.isPending}
      className="w-full rounded-lg bg-[hsl(var(--primary))] py-1.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[#0284C7] transition-colors disabled:opacity-50"
    >
      {follow.isPending ? t('common.loading') : t('profile.follow')}
    </button>
  )
}
