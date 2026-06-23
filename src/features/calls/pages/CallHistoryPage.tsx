import { useTranslation } from 'react-i18next'
import { Phone } from 'lucide-react'
import { useCallHistory } from '../hooks/useCallHistory'
import { CallHistoryItem } from '../components/CallHistoryItem'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function CallHistoryPage() {
  const { t } = useTranslation()
  const { data: calls, isLoading } = useCallHistory()

  if (isLoading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div>
      <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
          {t('calls.callHistory')}
        </h1>
      </div>

      {!calls || calls.length === 0 ? (
        <EmptyState
          icon={<Phone className="h-12 w-12" />}
          title={t('calls.noCallHistory')}
          description="Your call history will appear here"
        />
      ) : (
        <div className="divide-y divide-[hsl(var(--border))]">
          {calls.map((call) => (
            <CallHistoryItem key={call.id} call={call} />
          ))}
        </div>
      )}
    </div>
  )
}
