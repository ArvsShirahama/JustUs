import { Phone, PhoneOff, PhoneMissed, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CallWithUsers } from '@/services/supabase/calls'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { ROUTES } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'

interface CallHistoryItemProps {
  call: CallWithUsers
}

export function CallHistoryItem({ call }: CallHistoryItemProps) {
  const user = useAuthStore((s) => s.user)
  const isCaller = call.caller_id === user?.id
  const otherUser = isCaller ? call.callee : call.caller

  const statusIcon = () => {
    if (call.status === 'missed') {
      return isCaller ? (
        <PhoneOff className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
      ) : (
        <PhoneMissed className="h-5 w-5 text-[#EF4444]" />
      )
    }
    return call.type === 'video' ? (
      <Video className="h-5 w-5 text-[#22C55E]" />
    ) : (
      <Phone className="h-5 w-5 text-[#22C55E]" />
    )
  }

  const statusLabel = () => {
    switch (call.status) {
      case 'missed':
        return isCaller ? 'Cancelled' : 'Missed'
      case 'completed':
        return call.duration_seconds
          ? `${Math.floor(call.duration_seconds / 60)}:${(call.duration_seconds % 60).toString().padStart(2, '0')}`
          : 'Completed'
      case 'declined':
        return 'Declined'
      case 'cancelled':
        return 'Cancelled'
    }
  }

  return (
    <Link
      to={ROUTES.profile(otherUser.username)}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
    >
      <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] overflow-hidden shrink-0">
        {otherUser.avatar_url ? (
          <img
            src={otherUser.avatar_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))]">
            {otherUser.display_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            {otherUser.display_name}
          </p>
          {statusIcon()}
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          {statusLabel()} &middot; {formatRelativeTime(call.started_at)}
        </p>
      </div>
    </Link>
  )
}
