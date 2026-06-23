import { supabase } from './client'
import type { Call } from '@/types/database.types'

export interface CallWithUsers extends Call {
  caller: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
  callee: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export async function createCall(
  callerId: string,
  calleeId: string,
  type: 'voice' | 'video'
): Promise<Call> {
  const { data, error } = await supabase
    .from('calls')
    .insert({
      caller_id: callerId,
      callee_id: calleeId,
      type,
      status: 'missed',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCallStatus(
  callId: string,
  status: Call['status'],
  durationSeconds?: number
): Promise<void> {
  const updates: Partial<Call> = { status }

  if (status === 'completed') {
    updates.ended_at = new Date().toISOString()
    if (durationSeconds !== undefined) {
      updates.duration_seconds = durationSeconds
    }
  }

  const { error } = await supabase
    .from('calls')
    .update(updates)
    .eq('id', callId)

  if (error) throw error
}

export async function getCallHistory(
  userId: string
): Promise<CallWithUsers[]> {
  const { data, error } = await supabase
    .from('calls')
    .select(
      `
      *,
      caller:caller_id(id, username, display_name, avatar_url),
      callee:callee_id(id, username, display_name, avatar_url)
    `
    )
    .or(`caller_id.eq.${userId},callee_id.eq.${userId}`)
    .order('started_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data as unknown as CallWithUsers[]
}

export function subscribeToIncomingCalls(
  userId: string,
  callback: (call: CallWithUsers) => void
) {
  return supabase
    .channel(`calls:${userId}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'calls',
        filter: `callee_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as CallWithUsers)
      }
    )
    .subscribe()
}
