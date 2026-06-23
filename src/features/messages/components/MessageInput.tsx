import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Image, Mic } from 'lucide-react'
import { useSendMessage } from '../hooks/useSendMessage'
import { useTypingIndicator } from '../hooks/useTypingIndicator'
import { validateFile } from '@/services/compression/media'

interface MessageInputProps {
  conversationId: string
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sendMessage = useSendMessage(conversationId)
  const { typingUsers, emitTyping } = useTypingIndicator(conversationId)

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage.mutate(
      { content: text.trim() },
      { onSuccess: () => setText('') }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    emitTyping()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const error = validateFile(file, {
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })

    if (error) return

    sendMessage.mutate({ file })
    e.target.value = ''
  }

  const isPending = sendMessage.isPending

  return (
    <div className="border-t border-[hsl(var(--border))] px-4 py-3">
      {typingUsers.length > 0 && (
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 italic">
          {t('messages.isTyping')}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <Image className="h-5 w-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('messages.typeMessage')}
          className="flex-1 rounded-full bg-[hsl(var(--muted))] px-4 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
        />

        {text.trim() ? (
          <button
            onClick={handleSend}
            disabled={isPending}
            className="rounded-full p-2 text-[#0EA5E9] disabled:opacity-50 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        ) : (
          <button className="rounded-full p-2 text-[hsl(var(--muted-foreground))] transition-colors">
            <Mic className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
