import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, Square, Loader2 } from 'lucide-react'

interface VoiceNoteRecorderProps {
  onSend: (blob: Blob) => void
  isPending: boolean
}

export function VoiceNoteRecorder({ onSend, isPending }: VoiceNoteRecorderProps) {
  const { t } = useTranslation()
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        if (blob.size > 0) {
          onSend(blob)
        }
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch {
      console.error('Microphone access denied')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[hsl(var(--destructive))/10]">
        <div className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse" />
        <span className="text-sm font-medium text-[#EF4444]">
          {formatDuration(duration)}
        </span>
        <button
          onClick={stopRecording}
          className="rounded-full p-1 hover:bg-[hsl(var(--destructive))/20] transition-colors"
        >
          <Square className="h-4 w-4 text-[#EF4444]" />
        </button>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="rounded-full p-2">
        <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--primary))]" />
      </div>
    )
  }

  return (
    <button
      onClick={startRecording}
      className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
      title={t('messages.voiceNote')}
    >
      <Mic className="h-5 w-5" />
    </button>
  )
}
