import imageCompression from 'browser-image-compression'

export async function compressImage(
  file: File,
  options?: Partial<{
    maxSizeMB: number
    maxWidthOrHeight: number
    useWebWorker: boolean
  }>
): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: options?.maxSizeMB ?? 1,
    maxWidthOrHeight: options?.maxWidthOrHeight ?? 1080,
    useWebWorker: options?.useWebWorker ?? true,
  })
}

export function validateFile(
  file: File,
  options?: Partial<{
    maxSizeMB: number
    allowedTypes: string[]
  }>
): string | null {
  const maxSize = (options?.maxSizeMB ?? 5) * 1024 * 1024
  const allowed = options?.allowedTypes ?? ['image/jpeg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    return `File is too large. Max size is ${options?.maxSizeMB ?? 5}MB`
  }

  if (!allowed.includes(file.type)) {
    return `File type ${file.type} is not supported`
  }

  return null
}
