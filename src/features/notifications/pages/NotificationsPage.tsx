import { useTranslation } from 'react-i18next'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications'
import { NotificationItem } from '../components/NotificationItem'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function NotificationsPage() {
  const { t } = useTranslation()
  const { notifications, isLoading, markRead, markAllRead } =
    useNotifications()

  useRealtimeNotifications()

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
          {t('notifications.title')}
        </h1>
        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--primary))] hover:underline disabled:opacity-50"
          >
            {markAllRead.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title={t('notifications.noNotifications')}
          description="When someone interacts with you, it'll show up here"
        />
      ) : (
        <div className="divide-y divide-[hsl(var(--border))]">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={(id) => markRead.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
