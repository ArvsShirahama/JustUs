import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { useConversations } from '../hooks/useConversations'
import { ConversationItem } from './ConversationItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'

interface ConversationListProps {
  onNewChat: () => void
}

export function ConversationList({ onNewChat }: ConversationListProps) {
  const { t } = useTranslation()
  const { data: conversations, isLoading } = useConversations()

  if (isLoading) {
    return <LoadingSpinner className="py-12" />
  }

  if (!conversations || conversations.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle className="h-12 w-12" />}
        title={t('messages.noMessages')}
        description={t('messages.startConversation')}
        action={
          <button
            onClick={onNewChat}
            className="rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[#0284C7] transition-colors"
          >
            {t('messages.newMessage')}
          </button>
        }
      />
    )
  }

  return (
    <div className="divide-y divide-[hsl(var(--border))]">
      {conversations.map((conv) => (
        <ConversationItem key={conv.id} conversation={conv} />
      ))}
    </div>
  )
}
