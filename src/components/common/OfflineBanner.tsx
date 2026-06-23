import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#EF4444] text-white text-center py-1 text-xs font-medium">
      <div className="flex items-center justify-center gap-1">
        <WifiOff className="h-3 w-3" />
        No internet connection
      </div>
    </div>
  )
}
