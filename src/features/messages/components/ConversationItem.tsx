import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import type { ConversationWithDetails } from '@/services/supabase/messages'
import { useAuthStore } from '@/features/auth/stores/auth.store'

interface ConversationItemProps {
  conversation: ConversationWithDetails
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const user = useAuthStore((s) => s.user)

  const otherParticipant = conversation.participants.find(
    (p) => p.user_id !== user?.id
  )?.profiles

  if (!otherParticipant) return null

  return (
    <Link
      to={ROUTES.conversation(conversation.id)}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors"
    >
      <div className="h-12 w-12 rounded-full bg-[hsl(var(--muted))] overflow-hidden shrink-0">
        {otherParticipant.avatar_url ? (
          <img
            src={otherParticipant.avatar_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[hsl(var(--muted-foreground))]">
            {otherParticipant.display_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
            {otherParticipant.display_name}
          </h3>
          {conversation.last_message && (
            <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0 ml-2">
              {new Date(conversation.last_message.created_at).toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric' }
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">
            {conversation.last_message?.content ?? 'No messages yet'}
          </p>
          {conversation.unread_count > 0 && (
            <span className="shrink-0 h-5 min-w-[20px] flex items-center justify-center rounded-full bg-[#0EA5E9] px-1.5 text-[10px] font-bold text-white">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
