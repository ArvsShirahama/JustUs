import { Link } from 'react-router-dom'
import { Heart, MessageCircle, UserPlus, Phone, MessageSquare } from 'lucide-react'
import type { NotificationWithActor } from '@/services/supabase/notifications'
import { ROUTES } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: NotificationWithActor
  onMarkRead: (id: string) => void
}

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  message: MessageSquare,
  call: Phone,
}

export function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type]

  const getLink = () => {
    switch (notification.type) {
      case 'like':
      case 'comment':
        return notification.reference_id
          ? `/p/${notification.reference_id}`
          : ROUTES.profile(notification.actor.username)
      case 'follow':
        return ROUTES.profile(notification.actor.username)
      case 'message':
        return ROUTES.conversation(notification.reference_id ?? '')
      case 'call':
        return ROUTES.callHistory
      default:
        return '#'
    }
  }

  const getText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post'
      case 'comment':
        return 'commented on your post'
      case 'follow':
        return 'started following you'
      case 'message':
        return 'sent you a message'
      case 'call':
        return 'called you'
      default:
        return ''
    }
  }

  return (
    <Link
      to={getLink()}
      onClick={() => {
        if (!notification.is_read) {
          onMarkRead(notification.id)
        }
      }}
      className={cn(
        'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[hsl(var(--muted))]',
        !notification.is_read && 'bg-[hsl(var(--primary))/5]'
      )}
    >
      <div className="shrink-0">
        <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
          {notification.actor.avatar_url ? (
            <img
              src={notification.actor.avatar_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))]">
              {notification.actor.display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[hsl(var(--foreground))]">
          <span className="font-semibold">
            {notification.actor.display_name}
          </span>{' '}
          {getText()}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>

      <Icon className="h-5 w-5 shrink-0 mt-1 text-[hsl(var(--muted-foreground))]" />
    </Link>
  )
}
