import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  searchUsers,
  searchPosts,
  searchHashtags,
} from '@/services/supabase/search'
import { useDebounce } from '@/hooks/useDebounce'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'hashtags'>(
    'users'
  )
  const debouncedQuery = useDebounce(query, 300)

  const usersQuery = useQuery({
    queryKey: ['search-users', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && activeTab === 'users',
  })

  const postsQuery = useQuery({
    queryKey: ['search-posts', debouncedQuery],
    queryFn: () => searchPosts(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && activeTab === 'posts',
  })

  const hashtagsQuery = useQuery({
    queryKey: ['search-hashtags', debouncedQuery],
    queryFn: () => searchHashtags(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && activeTab === 'hashtags',
  })

  return {
    query,
    setQuery,
    activeTab,
    setActiveTab,
    debouncedQuery,
    users: usersQuery.data ?? [],
    posts: postsQuery.data ?? [],
    hashtags: hashtagsQuery.data ?? [],
    isLoading:
      usersQuery.isLoading || postsQuery.isLoading || hashtagsQuery.isLoading,
  }
}
