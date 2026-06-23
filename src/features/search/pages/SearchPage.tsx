import { useTranslation } from 'react-i18next'
import { Search as SearchIcon, Clock } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'
import { SearchBar } from '../components/SearchBar'
import { SearchResults } from '../components/SearchResults'
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from '@/services/supabase/search'

export default function SearchPage() {
  const { t } = useTranslation()
  const {
    query,
    setQuery,
    activeTab,
    setActiveTab,
    users,
    posts,
    hashtags,
    isLoading,
  } = useSearch()

  const recentSearches = getRecentSearches()

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim().length >= 2) {
      addRecentSearch(value.trim())
    }
  }

  return (
    <div>
      <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))] mb-3">
          {t('search.title')}
        </h1>
        <SearchBar
          value={query}
          onChange={handleSearch}
          placeholder={t('search.searchUsers')}
        />
      </div>

      {!query ? (
        // Recent searches
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              {t('search.recent')}
            </h2>
            {recentSearches.length > 0 && (
              <button
                onClick={clearRecentSearches}
                className="text-sm text-[hsl(var(--primary))] hover:underline"
              >
                {t('search.clearRecent')}
              </button>
            )}
          </div>

          {recentSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SearchIcon className="h-12 w-12 text-[hsl(var(--muted-foreground))] mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {t('common.search')}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(search)}
                  className="flex w-full items-center gap-3 px-2 py-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-sm text-[hsl(var(--foreground))]">
                    {search}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <SearchResults
          activeTab={activeTab}
          users={users}
          posts={posts}
          hashtags={hashtags}
          isLoading={isLoading}
          query={query}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  )
}
