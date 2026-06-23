import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import type { Profile } from '@/types/database.types'
import type { SearchPostResult } from '@/services/supabase/search'

interface SearchResultsProps {
  activeTab: 'users' | 'posts' | 'hashtags'
  users: Profile[]
  posts: SearchPostResult[]
  hashtags: { hashtag: string; post_count: number }[]
  isLoading: boolean
  query: string
  onTabChange: (tab: 'users' | 'posts' | 'hashtags') => void
}

export function SearchResults({
  activeTab,
  users,
  posts,
  hashtags,
  isLoading,
  query,
  onTabChange,
}: SearchResultsProps) {
  const { t } = useTranslation()

  const tabs = [
    { key: 'users' as const, label: t('search.users') },
    { key: 'posts' as const, label: t('search.posts') },
    { key: 'hashtags' as const, label: t('search.hashtags') },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-[hsl(var(--border))]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex-1 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab.key
                ? 'border-[hsl(var(--foreground))] text-[hsl(var(--foreground))]'
                : 'border-transparent text-[hsl(var(--muted-foreground))]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
        </div>
      )}

      {/* No results */}
      {!isLoading && query.length >= 2 && (
        <>
          {/* Users */}
          {activeTab === 'users' && users.length === 0 && (
            <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              {t('common.noResults')}
            </p>
          )}
          {activeTab === 'users' && users.map((user) => (
            <Link
              key={user.id}
              to={ROUTES.profile(user.username)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] overflow-hidden shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))]">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {user.display_name}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}

          {/* Posts */}
          {activeTab === 'posts' && posts.length === 0 && (
            <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              {t('common.noResults')}
            </p>
          )}
          {activeTab === 'posts' && posts.map((post) => (
            <Link
              key={post.id}
              to="#"
              className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
            >
              {post.media_urls[0] && (
                <div className="h-10 w-10 rounded bg-[hsl(var(--muted))] overflow-hidden shrink-0">
                  <img src={post.media_urls[0]} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[hsl(var(--foreground))] line-clamp-2">
                  {post.caption ?? 'No caption'}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                  {post.likes_count ?? 0} likes &middot; @{post.profiles?.username}
                </p>
              </div>
            </Link>
          ))}

          {/* Hashtags */}
          {activeTab === 'hashtags' && hashtags.length === 0 && (
            <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              {t('common.noResults')}
            </p>
          )}
          {activeTab === 'hashtags' && hashtags.map((tag) => (
            <Link
              key={tag.hashtag}
              to="#"
              className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  #{tag.hashtag}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {tag.post_count} posts
                </p>
              </div>
            </Link>
          ))}
        </>
      )}

      {/* Helper text for empty query */}
      {query.length < 2 && (
        <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  )
}
