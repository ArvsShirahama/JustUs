import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Search, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchUsers, getOrCreateConversation } from '@/services/supabase/messages'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useDebounce } from '@/hooks/useDebounce'
import { ROUTES } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'

interface NewConversationDialogProps {
  onClose: () => void
}

export function NewConversationDialog({ onClose }: NewConversationDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data: users, isLoading } = useQuery({
    queryKey: ['search-users', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  })

  const startConversation = useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user) throw new Error('Not authenticated')
      return getOrCreateConversation(user.id, otherUserId)
    },
    onSuccess: (conversationId) => {
      navigate(ROUTES.conversation(conversationId))
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[hsl(var(--background))] max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {t('messages.newMessage')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2 rounded-lg bg-[hsl(var(--muted))] px-3 py-2">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.searchUsers')}
              autoFocus
              className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--primary))]" />
            </div>
          )}

          {users && users.length === 0 && query.length >= 2 && (
            <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              {t('common.noResults')}
            </p>
          )}

          {users && (
            <div className="divide-y divide-[hsl(var(--border))]">
              {users
                .filter((u) => u.id !== user?.id)
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => startConversation.mutate(u.id)}
                    disabled={startConversation.isPending}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] overflow-hidden shrink-0">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))]">
                          {u.display_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {u.display_name}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        @{u.username}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
