import { useRef, useEffect, type ReactNode } from 'react'

interface FeedInfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean | undefined
  isLoading: boolean
  children: ReactNode
}

export function FeedInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  children,
}: FeedInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore, isLoading])

  return (
    <div>
      {children}
      <div ref={sentinelRef} className="h-4" />
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
        </div>
      )}
    </div>
  )
}
