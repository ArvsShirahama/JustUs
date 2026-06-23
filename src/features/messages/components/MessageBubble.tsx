import { cn } from '@/lib/utils'
import { Check, CheckCheck } from 'lucide-react'
import type { MessageWithSender } from '@/services/supabase/messages'

interface MessageBubbleProps {
  message: MessageWithSender
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex mb-2',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-[#0EA5E9] text-white rounded-br-md'
            : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-md'
        )}
      >
        {message.media_url && message.media_type === 'image' && (
          <img
            src={message.media_url}
            alt=""
            className="max-w-full rounded-lg mb-1"
            loading="lazy"
          />
        )}

        {message.media_url && message.media_type === 'audio' && (
          <audio src={message.media_url} controls className="max-w-full h-10 mb-1" />
        )}

        {message.content && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            isOwn ? 'justify-end' : 'justify-start'
          )}
        >
          <span
            className={cn(
              'text-[10px]',
              isOwn ? 'text-white/70' : 'text-[hsl(var(--muted-foreground))]'
            )}
          >
            {new Date(message.created_at).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwn && (
            <span className="text-[10px]">
              {message.status === 'seen' ? (
                <CheckCheck className="h-3 w-3 text-[#22C55E]" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="h-3 w-3 text-white/70" />
              ) : (
                <Check className="h-3 w-3 text-white/70" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
