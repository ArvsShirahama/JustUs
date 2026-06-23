import { useNotificationsStore } from '../stores/notifications.store'

export function NotificationBadge() {
  const unreadCount = useNotificationsStore((s) => s.unreadCount)

  if (unreadCount === 0) return null

  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white leading-none">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}
