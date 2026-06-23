import { useTranslation } from 'react-i18next'
import { Image } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface ProfileGridProps {
  posts: { id: string; media_urls: string[] }[] | undefined
  isLoading: boolean
}

export function ProfileGrid({ posts, isLoading }: ProfileGridProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingSpinner className="py-12" />
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        icon={<Image className="h-12 w-12" />}
        title={t('feed.noPosts')}
        description="Share your first post to get started"
      />
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 px-1">
      {posts.map((post) => (
        <div
          key={post.id}
          className="aspect-square bg-[hsl(var(--muted))] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
        >
          {post.media_urls[0] && (
            <img
              src={post.media_urls[0]}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  )
}
