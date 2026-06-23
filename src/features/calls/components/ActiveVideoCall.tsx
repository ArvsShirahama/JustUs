import { useRef, useEffect } from 'react'
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  Maximize2,
} from 'lucide-react'
import { useCallStore } from '../stores/call.store'
import { CallTimer } from './CallTimer'

interface ActiveVideoCallProps {
  otherUserName: string
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  onEndCall: () => void
}

export function ActiveVideoCall({
  otherUserName,
  localStream,
  remoteStream,
  onEndCall,
}: ActiveVideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const isMuted = useCallStore((s) => s.isMuted)
  const isCameraOn = useCallStore((s) => s.isCameraOn)
  const isFullScreen = useCallStore((s) => s.isFullScreen)
  const setMuted = useCallStore((s) => s.setMuted)
  const setCameraOn = useCallStore((s) => s.setCameraOn)
  const setFullScreen = useCallStore((s) => s.setFullScreen)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOn
      })
    }
  }, [isCameraOn, localStream])

  return (
    <div
      className={`fixed inset-0 z-50 bg-black ${
        isFullScreen ? '' : 'p-4'
      }`}
    >
      {/* Remote video (full background) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover rounded-lg"
      />

      {/* Local video (PiP) */}
      <div className="absolute top-4 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white/30">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      </div>

      {/* Top info */}
      <div className="absolute top-4 left-4">
        <h2 className="text-lg font-bold text-white">{otherUserName}</h2>
        <p className="text-sm text-white/70">
          <CallTimer />
        </p>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setMuted(!isMuted)}
            className={`rounded-full p-4 transition-colors ${
              isMuted ? 'bg-[#EF4444]' : 'bg-white/20'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={onEndCall}
            className="rounded-full bg-[#EF4444] p-4"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => setCameraOn(!isCameraOn)}
            className={`rounded-full p-4 transition-colors ${
              !isCameraOn ? 'bg-[#EF4444]' : 'bg-white/20'
            }`}
          >
            {isCameraOn ? (
              <Camera className="h-6 w-6 text-white" />
            ) : (
              <CameraOff className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={() => setFullScreen(!isFullScreen)}
            className="rounded-full bg-white/20 p-4"
          >
            <Maximize2 className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
