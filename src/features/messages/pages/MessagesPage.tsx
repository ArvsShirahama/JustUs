import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit } from 'lucide-react'
import { ConversationList } from '../components/ConversationList'
import { NewConversationDialog } from '../components/NewConversationDialog'

export default function MessagesPage() {
  const { t } = useTranslation()
  const [showNew, setShowNew] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
          {t('messages.title')}
        </h1>
        <button
          onClick={() => setShowNew(true)}
          className="rounded-full p-2 hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <Edit className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </button>
      </div>

      <ConversationList onNewChat={() => setShowNew(true)} />

      {showNew && (
        <NewConversationDialog onClose={() => setShowNew(false)} />
      )}
    </div>
  )
}
