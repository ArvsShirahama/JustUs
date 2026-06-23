import { useCallback } from 'react'
import { useCallStore } from '../stores/call.store'

export function useMediaStream() {
  const setMediaStream = useCallStore((s) => s.setMediaStream)

  const getStream = useCallback(
    async (video = false): Promise<MediaStream | null> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video,
        })
        setMediaStream(stream)
        return stream
      } catch {
        console.error('Failed to get media stream')
        return null
      }
    },
    [setMediaStream]
  )

  const stopStream = useCallback(() => {
    const current = useCallStore.getState().mediaStream
    if (current) {
      current.getTracks().forEach((t) => t.stop())
    }
    setMediaStream(null)
  }, [setMediaStream])

  return { getStream, stopStream }
}
