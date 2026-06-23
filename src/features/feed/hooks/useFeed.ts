import { useInfiniteQuery } from '@tanstack/react-query'
import { getFeedPosts } from '@/services/supabase/posts'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function useFeed() {
  const user = useAuthStore((s) => s.user)

  return useInfiniteQuery({
    queryKey: ['feed', user?.id],
    queryFn: ({ pageParam = 0 }) => {
      if (!user) throw new Error('Not authenticated')
      return getFeedPosts(user.id, pageParam)
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined
      return allPages.length
    },
    initialPageParam: 0,
    enabled: !!user,
    staleTime: 1000 * 30,
  })
}
