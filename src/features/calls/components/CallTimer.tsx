import { useEffect } from 'react'
import { useCallStore } from '../stores/call.store'

export function CallTimer() {
  const callDuration = useCallStore((s) => s.callDuration)
  const setCallDuration = useCallStore((s) => s.setCallDuration)
  const callStatus = useCallStore((s) => s.callStatus)

  useEffect(() => {
    if (callStatus !== 'connected') return

    const interval = setInterval(() => {
      setCallDuration(Date.now() - 0)
    }, 1000)

    return () => clearInterval(interval)
  }, [callStatus, setCallDuration])

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <span className="text-sm font-medium tabular-nums">
      {formatDuration(Math.floor(callDuration / 1000))}
    </span>
  )
}
