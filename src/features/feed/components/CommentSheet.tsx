import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Send, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useComments } from '../hooks/useComments'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { ROUTES } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'

interface CommentSheetProps {
  postId: string
  onClose: () => void
}

export function CommentSheet({ postId, onClose }: CommentSheetProps) {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.user)
  const { comments, isLoading, addComment, removeComment } =
    useComments(postId)
  const [content, setContent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    addComment.mutate(content.trim(), {
      onSuccess: () => setContent(''),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[hsl(var(--background))] max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {t('feed.comment')}s
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              No comments yet
            </p>
          ) : (
            <div className="divide-y divide-[hsl(var(--border))]">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 px-4 py-3">
                  <Link
                    to={ROUTES.profile(comment.profiles.username)}
                    className="shrink-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                      {comment.profiles.avatar_url ? (
                        <img
                          src={comment.profiles.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[hsl(var(--muted-foreground))]">
                          {comment.profiles.display_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[hsl(var(--foreground))]">
                      <Link
                        to={ROUTES.profile(comment.profiles.username)}
                        className="font-semibold hover:underline"
                      >
                        {comment.profiles.display_name}
                      </Link>{' '}
                      {comment.content}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {formatRelativeTime(comment.created_at)}
                    </p>
                  </div>
                  {currentUser?.id === comment.user_id && (
                    <button
                      onClick={() => removeComment.mutate(comment.id)}
                      className="shrink-0 rounded-full p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-[hsl(var(--border))] px-4 py-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('feed.addComment')}
            className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || addComment.isPending}
            className="rounded-full p-1 text-[hsl(var(--primary))] disabled:opacity-50 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
