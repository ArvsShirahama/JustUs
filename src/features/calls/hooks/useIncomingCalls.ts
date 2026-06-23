import { useEffect } from 'react'
import { supabase } from '@/services/supabase/client'
import { subscribeToIncomingCalls } from '@/services/supabase/calls'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useCallStore } from '../stores/call.store'

export function useIncomingCalls() {
  const user = useAuthStore((s) => s.user)
  const setIncomingCall = useCallStore((s) => s.setIncomingCall)
  const callStatus = useCallStore((s) => s.callStatus)

  useEffect(() => {
    if (!user) return

    const subscription = subscribeToIncomingCalls(user.id, (call) => {
      if (callStatus === 'idle') {
        setIncomingCall(call)
      }
    })

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, callStatus, setIncomingCall])
}
