import { useTranslation } from 'react-i18next'
import { Phone, PhoneOff } from 'lucide-react'
import { useCallStore } from '../stores/call.store'

interface IncomingCallDialogProps {
  onAccept: () => void
  onDecline: () => void
}

export function IncomingCallDialog({
  onAccept,
  onDecline,
}: IncomingCallDialogProps) {
  const { t } = useTranslation()
  const incomingCall = useCallStore((s) => s.incomingCall)

  if (!incomingCall) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-[hsl(var(--background))] p-6 text-center">
        <div className="mb-6">
          <div className="h-20 w-20 rounded-full bg-[hsl(var(--muted))] overflow-hidden mx-auto mb-3">
            {incomingCall.caller.avatar_url ? (
              <img
                src={incomingCall.caller.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[hsl(var(--muted-foreground))]">
                {incomingCall.caller.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
            {incomingCall.caller.display_name}
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {t('calls.incomingCall')}...
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] capitalize">
            {incomingCall.type} {t('calls.voiceCall').toLowerCase()}
          </p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button
            onClick={onDecline}
            className="flex flex-col items-center gap-2"
          >
            <div className="rounded-full bg-[#EF4444] p-4">
              <PhoneOff className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-[hsl(var(--foreground))]">
              {t('calls.decline')}
            </span>
          </button>

          <button
            onClick={onAccept}
            className="flex flex-col items-center gap-2"
          >
            <div className="rounded-full bg-[#22C55E] p-4">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-[hsl(var(--foreground))]">
              {t('calls.accept')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
