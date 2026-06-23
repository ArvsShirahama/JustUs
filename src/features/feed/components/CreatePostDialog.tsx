import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Image, Loader2 } from 'lucide-react'
import { useCreatePost } from '../hooks/useCreatePost'
import { MAX_IMAGES_PER_POST, POST_TEXT_MAX_LENGTH } from '@/lib/constants'

interface CreatePostDialogProps {
  onClose: () => void
}

export function CreatePostDialog({ onClose }: CreatePostDialogProps) {
  const { t } = useTranslation()
  const createPost = useCreatePost()
  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    const remaining = MAX_IMAGES_PER_POST - files.length
    const toAdd = selected.slice(0, remaining)

    setFiles((prev) => [...prev, ...toAdd])
    setPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ])
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (files.length === 0) return

    createPost.mutate(
      { caption, files },
      {
        onSuccess: () => {
          previews.forEach((p) => URL.revokeObjectURL(p))
          onClose()
        },
      }
    )
  }

  const isValid = files.length > 0 && !createPost.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-[hsl(var(--background))] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors">
            <X className="h-5 w-5 text-[hsl(var(--foreground))]" />
          </button>
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {t('feed.createPost')}
          </h2>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="text-sm font-semibold text-[hsl(var(--primary))] disabled:opacity-50 hover:text-[#0284C7] transition-colors"
          >
            {createPost.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t('feed.post')
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <textarea
            placeholder={t('feed.whatsOnYourMind')}
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, POST_TEXT_MAX_LENGTH))}
            rows={4}
            className="w-full resize-none bg-transparent text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none text-sm"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[hsl(var(--muted))]">
                  <img
                    src={preview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_IMAGES_PER_POST}
            className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] disabled:opacity-50"
          >
            <Image className="h-5 w-5" />
            Add photos
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {createPost.error && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {createPost.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
