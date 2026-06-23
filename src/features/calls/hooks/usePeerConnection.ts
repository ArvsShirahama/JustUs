import { useEffect, useCallback } from 'react'
import { getPeer, destroyPeer } from '@/services/peerjs/peer'
import { useCallStore } from '../stores/call.store'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { MediaConnection } from 'peerjs'

export function usePeerConnection() {
  const user = useAuthStore((s) => s.user)
  const setPeerId = useCallStore((s) => s.setPeerId)
  const setCallStatus = useCallStore((s) => s.setCallStatus)
  const setMediaStream = useCallStore((s) => s.setMediaStream)

  useEffect(() => {
    if (!user) return

    const peer = getPeer(user.id)

    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('error', (err) => {
      console.error('PeerJS error:', err)
    })

    return () => {
      destroyPeer()
    }
  }, [user, setPeerId])

  const callPeer = useCallback(
    (targetPeerId: string, stream: MediaStream): MediaConnection | null => {
      const peer = getPeer(user?.id ?? '')
      if (!peer) return null

      const mediaCall = peer.call(targetPeerId, stream)
      setCallStatus('connecting')

      mediaCall.on('stream', (remoteStream) => {
        setMediaStream(remoteStream)
        setCallStatus('connected')
      })

      mediaCall.on('close', () => {
        setCallStatus('ended')
      })

      return mediaCall
    },
    [user, setCallStatus, setMediaStream]
  )

  const answerCall = useCallback(
    (call: MediaConnection, stream: MediaStream) => {
      call.answer(stream)
      setCallStatus('connecting')

      call.on('stream', (remoteStream) => {
        setMediaStream(remoteStream)
        setCallStatus('connected')
      })

      call.on('close', () => {
        setCallStatus('ended')
      })

      return call
    },
    [setCallStatus, setMediaStream]
  )

  return { callPeer, answerCall }
}
