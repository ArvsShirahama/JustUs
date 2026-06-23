import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusSquare } from 'lucide-react'
import { useFeed } from '../hooks/useFeed'
import { PostCard } from '../components/PostCard'
import { PostSkeleton } from '../components/PostSkeleton'
import { CreatePostDialog } from '../components/CreatePostDialog'
import { FeedInfiniteScroll } from '../components/FeedInfiniteScroll'
import { EmptyState } from '@/components/common/EmptyState'
import { APP_NAME } from '@/lib/constants'

export default function FeedPage() {
  const { t } = useTranslation()
  const [showCreate, setShowCreate] = useState(false)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed()

  const posts = data?.pages.flat() ?? []

  const handleLoadMore = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
          {APP_NAME}
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-full p-2 hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <PlusSquare className="h-6 w-6 text-[hsl(var(--foreground))]" />
        </button>
      </div>

      {isLoading ? (
        <div className="pt-2">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[hsl(var(--destructive))]">{t('common.error')}</p>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title={t('feed.noPosts')}
          description="Follow people to see their posts here"
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[#0284C7] transition-colors"
            >
              {t('feed.createPost')}
            </button>
          }
        />
      ) : (
        <FeedInfiniteScroll
          onLoadMore={handleLoadMore}
          hasMore={hasNextPage}
          isLoading={isFetchingNextPage}
        >
          <div className="pt-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </FeedInfiniteScroll>
      )}

      {showCreate && (
        <CreatePostDialog onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
