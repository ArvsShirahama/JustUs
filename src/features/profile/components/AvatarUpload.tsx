import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from 'lucide-react'
import { useEditProfile } from '../hooks/useEditProfile'
import { validateFile } from '@/services/compression/media'

interface AvatarUploadProps {
  currentUrl: string | null
  displayName: string
}

export function AvatarUpload({ currentUrl, displayName }: AvatarUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadAvatar } = useEditProfile()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file, {
      maxSizeMB: 2,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    uploadAvatar.mutate(file)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={uploadAvatar.isPending}
        className="relative h-24 w-24 rounded-full bg-[hsl(var(--muted))] overflow-hidden hover:opacity-80 transition-opacity"
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[hsl(var(--muted-foreground))]">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
          <Camera className="h-8 w-8 text-white" />
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {uploadAvatar.isPending && (
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {t('common.loading')}
        </p>
      )}

      {error && (
        <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
      >
        {t('profile.changePhoto')}
      </button>
    </div>
  )
}
