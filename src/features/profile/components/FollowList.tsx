import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Profile } from '@/types/database.types'
import { ROUTES } from '@/lib/constants'

interface FollowListProps {
  users: Profile[]
  title: string
  onClose: () => void
  isLoading?: boolean
}

export function FollowList({ users, title, onClose, isLoading }: FollowListProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[hsl(var(--background))] max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              No users yet
            </p>
          ) : (
            <div className="divide-y divide-[hsl(var(--border))]">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to={ROUTES.profile(user.username)}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] overflow-hidden shrink-0">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))]">
                        {user.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                      {user.display_name}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
