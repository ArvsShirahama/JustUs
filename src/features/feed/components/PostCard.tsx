import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useLikePost } from '../hooks/useLikePost'
import { useSavePost } from '../hooks/useSavePost'
import { useDeletePost } from '../hooks/useDeletePost'
import { formatRelativeTime } from '@/lib/utils'
import { CommentSheet } from './CommentSheet'
import type { PostWithDetails } from '@/services/supabase/posts'

interface PostCardProps {
  post: PostWithDetails
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.user)
  const toggleLike = useLikePost()
  const toggleSave = useSavePost()
  const deletePost = useDeletePost()
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const isOwner = currentUser?.id === post.user_id

  const handleLike = () => {
    toggleLike.mutate({ postId: post.id, hasLiked: post.has_liked })
  }

  const handleSave = () => {
    toggleSave.mutate({ postId: post.id, hasSaved: post.has_saved })
  }

  const handleDelete = () => {
    if (confirm('Delete this post?')) {
      deletePost.mutate(post.id)
    }
    setShowMenu(false)
  }

  return (
    <div className="border-b border-[hsl(var(--border))] pb-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to={ROUTES.profile(post.profiles.username)}
          className="flex items-center gap-3"
        >
          <div className="h-8 w-8 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
            {post.profiles.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[hsl(var(--muted-foreground))]">
                {post.profiles.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            {post.profiles.display_name}
          </span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-[hsl(var(--foreground))]" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-lg py-1">
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[hsl(var(--destructive))] hover:bg-[hsl(var(--muted))]"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('feed.deletePost')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Media */}
      {post.media_urls.length > 0 && (
        <div className="relative bg-[hsl(var(--muted))]">
          {post.media_types[imgIndex] === 'video' ? (
            <video
              src={post.media_urls[imgIndex]}
              controls
              className="w-full max-h-[500px] object-contain"
            />
          ) : (
            <img
              src={post.media_urls[imgIndex]}
              alt=""
              className="w-full max-h-[500px] object-contain"
              loading="lazy"
            />
          )}

          {post.media_urls.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {post.media_urls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors',
                    i === imgIndex
                      ? 'bg-[hsl(var(--primary))]'
                      : 'bg-[hsl(var(--muted-foreground))/50]'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="transition-colors">
            <Heart
              className={cn(
                'h-6 w-6',
                post.has_liked
                  ? 'fill-[#EF4444] text-[#EF4444]'
                  : 'text-[hsl(var(--foreground))]'
              )}
            />
          </button>
          <button
            onClick={() => setShowComments(true)}
            className="transition-colors"
          >
            <MessageCircle className="h-6 w-6 text-[hsl(var(--foreground))]" />
          </button>
        </div>
        <button onClick={handleSave} className="transition-colors">
          <Bookmark
            className={cn(
              'h-6 w-6',
              post.has_saved
                ? 'fill-[hsl(var(--foreground))] text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--foreground))]'
            )}
          />
        </button>
      </div>

      {/* Likes */}
      {(post.likes_count ?? 0) > 0 && (
        <p className="px-4 pt-2 text-sm font-semibold text-[hsl(var(--foreground))]">
          {t('feed.likes', { count: post.likes_count ?? 0 })}
        </p>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pt-1">
          <span className="text-sm text-[hsl(var(--foreground))]">
            <Link
              to={ROUTES.profile(post.profiles.username)}
              className="font-semibold hover:underline"
            >
              {post.profiles.display_name}
            </Link>{' '}
            {post.caption}
          </span>
        </div>
      )}

      {/* Comments link */}
      {(post.comments_count ?? 0) > 0 && (
        <button
          onClick={() => setShowComments(true)}
          className="px-4 pt-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          {t('feed.comments', { count: post.comments_count ?? 0 })}
        </button>
      )}

      {/* Timestamp */}
      <p className="px-4 pt-1 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
        {formatRelativeTime(post.created_at)}
      </p>

      {/* Comment Sheet */}
      {showComments && (
        <CommentSheet
          postId={post.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  )
}
