import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Phone, Video } from 'lucide-react'
import { useMessages } from '../hooks/useMessages'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { MessageBubble } from '../components/MessageBubble'
import { MessageInput } from '../components/MessageInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/lib/constants'
import { useRef, useEffect } from 'react'

export default function ConversationPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const { messages, isLoading } = useMessages(id ?? '')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  if (isLoading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))] shrink-0">
        <Link
          to={ROUTES.messages}
          className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </Link>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Conversation
          </h2>
        </div>
        <button className="rounded-full p-2 hover:bg-[hsl(var(--muted))] transition-colors">
          <Phone className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </button>
        <button className="rounded-full p-2 hover:bg-[hsl(var(--muted))] transition-colors">
          <Video className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {t('messages.noMessages')}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === user?.id}
            />
          ))
        )}
      </div>

      {/* Input */}
      {id && <MessageInput conversationId={id} />}
    </div>
  )
}
