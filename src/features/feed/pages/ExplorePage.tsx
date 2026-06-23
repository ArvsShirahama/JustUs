import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useExplore } from '../hooks/useExplore'
import { FeedInfiniteScroll } from '../components/FeedInfiniteScroll'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Link } from 'react-router-dom'
export default function ExplorePage() {
  const { t } = useTranslation()
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExplore()

  const posts = data?.pages.flat() ?? []

  const handleLoadMore = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  if (isLoading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          {t('feed.explore')}
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          No trending posts yet
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
          {t('feed.explore')}
        </h1>
      </div>

      <FeedInfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
      >
        <div className="grid grid-cols-3 gap-1 p-1">
          {posts.map((post) => (
            <Link
              key={post.id}
              to="#"
              className="aspect-square bg-[hsl(var(--muted))] overflow-hidden hover:opacity-80 transition-opacity"
            >
              {post.media_urls[0] && (
                <img
                  src={post.media_urls[0]}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </Link>
          ))}
        </div>
      </FeedInfiniteScroll>
    </div>
  )
}
