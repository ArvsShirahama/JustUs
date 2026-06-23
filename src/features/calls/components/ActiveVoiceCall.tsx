import { useTranslation } from 'react-i18next'
import { Mic, MicOff, Volume2, PhoneOff } from 'lucide-react'
import { useCallStore } from '../stores/call.store'
import { CallTimer } from './CallTimer'

interface ActiveVoiceCallProps {
  otherUserName: string
  otherUserAvatar: string | null
  onEndCall: () => void
}

export function ActiveVoiceCall({
  otherUserName,
  otherUserAvatar,
  onEndCall,
}: ActiveVoiceCallProps) {
  const { t } = useTranslation()
  const isMuted = useCallStore((s) => s.isMuted)
  const isSpeakerOn = useCallStore((s) => s.isSpeakerOn)
  const setMuted = useCallStore((s) => s.setMuted)
  const setSpeakerOn = useCallStore((s) => s.setSpeakerOn)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(var(--background))]">
      <div className="text-center mb-12">
        <div className="h-24 w-24 rounded-full bg-[hsl(var(--muted))] overflow-hidden mx-auto mb-4">
          {otherUserAvatar ? (
            <img
              src={otherUserAvatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[hsl(var(--muted-foreground))]">
              {otherUserName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          {otherUserName}
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
          <CallTimer />
        </p>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={() => setMuted(!isMuted)}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`rounded-full p-4 transition-colors ${
              isMuted
                ? 'bg-[#EF4444] text-white'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {isMuted ? t('calls.unmute') : t('calls.mute')}
          </span>
        </button>

        <button
          onClick={() => setSpeakerOn(!isSpeakerOn)}
          className="flex flex-col items-center gap-2"
        >
          <div className="rounded-full bg-[hsl(var(--muted))] p-4 text-[hsl(var(--foreground))]">
            <Volume2 className="h-6 w-6" />
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {t('calls.speaker')}
          </span>
        </button>

        <button
          onClick={onEndCall}
          className="flex flex-col items-center gap-2"
        >
          <div className="rounded-full bg-[#EF4444] p-4">
            <PhoneOff className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {t('calls.endCall')}
          </span>
        </button>
      </div>
    </div>
  )
}
