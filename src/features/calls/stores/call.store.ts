import { create } from 'zustand'
import type { CallWithUsers } from '@/services/supabase/calls'

interface CallState {
  activeCall: CallWithUsers | null
  callType: 'voice' | 'video' | null
  callStatus: 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended'
  isMuted: boolean
  isSpeakerOn: boolean
  isCameraOn: boolean
  isFullScreen: boolean
  callDuration: number
  incomingCall: CallWithUsers | null
  peerId: string | null
  mediaStream: MediaStream | null

  setActiveCall: (call: CallWithUsers | null) => void
  setCallType: (type: 'voice' | 'video' | null) => void
  setCallStatus: (status: CallState['callStatus']) => void
  setMuted: (muted: boolean) => void
  setSpeakerOn: (on: boolean) => void
  setCameraOn: (on: boolean) => void
  setFullScreen: (fs: boolean) => void
  setCallDuration: (duration: number) => void
  setIncomingCall: (call: CallWithUsers | null) => void
  setPeerId: (id: string | null) => void
  setMediaStream: (stream: MediaStream | null) => void
  reset: () => void
}

const initialState = {
  activeCall: null,
  callType: null as 'voice' | 'video' | null,
  callStatus: 'idle' as const,
  isMuted: false,
  isSpeakerOn: false,
  isCameraOn: true,
  isFullScreen: false,
  callDuration: 0,
  incomingCall: null,
  peerId: null,
  mediaStream: null,
}

export const useCallStore = create<CallState>((set) => ({
  ...initialState,

  setActiveCall: (call) => set({ activeCall: call }),
  setCallType: (type) => set({ callType: type }),
  setCallStatus: (status) => set({ callStatus: status }),
  setMuted: (muted) => set({ isMuted: muted }),
  setSpeakerOn: (on) => set({ isSpeakerOn: on }),
  setCameraOn: (on) => set({ isCameraOn: on }),
  setFullScreen: (fs) => set({ isFullScreen: fs }),
  setCallDuration: (duration) => set({ callDuration: duration }),
  setIncomingCall: (call) => set({ incomingCall: call }),
  setPeerId: (id) => set({ peerId: id }),
  setMediaStream: (stream) => set({ mediaStream: stream }),
  reset: () => set(initialState),
}))
