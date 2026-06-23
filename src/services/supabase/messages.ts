import { supabase } from './client'
import { uploadFile } from './storage'
import type { Message, Conversation } from '@/types/database.types'

export interface ConversationWithDetails extends Conversation {
  participants: {
    user_id: string
    profiles: {
      id: string
      username: string
      display_name: string
      avatar_url: string | null
    }
  }[]
  last_message: Pick<Message, 'content' | 'created_at'> | null
  unread_count: number
}

export interface MessageWithSender extends Message {
  sender: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export async function getConversations(
  userId: string
): Promise<ConversationWithDetails[]> {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select(
      `
      conversation_id,
      last_read_at,
      conversations!inner(
        id,
        type,
        name,
        created_at,
        updated_at,
        participants:conversation_participants(
          user_id,
          profiles!user_id(id, username, display_name, avatar_url)
        ),
        last_message:messages(
          content,
          created_at
        )
      )
    `
    )
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false })

  if (error) throw error

  const convs = data.map((item) => {
    const conv = item.conversations as unknown as ConversationWithDetails
    return {
      ...conv,
      last_message: Array.isArray(conv.last_message)
        ? conv.last_message[conv.last_message.length - 1] ?? null
        : conv.last_message,
    }
  })

  return convs
}

export async function getOrCreateConversation(
  userId: string,
  otherUserId: string
): Promise<string> {
  const { data: existing } = await supabase.rpc('get_direct_conversation', {
    user_a: userId,
    user_b: otherUserId,
  })

  if (existing) return existing as string

  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ type: 'direct' })
    .select()
    .single()

  if (error) throw error

  const { error: insertError } = await supabase
    .from('conversation_participants')
    .insert({ conversation_id: conv.id, user_id: userId })

  if (insertError) throw insertError

  const { error: rpcError } = await supabase.rpc(
    'add_conversation_participant',
    { conv_id: conv.id, participant_id: otherUserId }
  )

  if (rpcError) throw rpcError
  return conv.id
}

export async function getMessages(
  conversationId: string,
  page = 0,
  pageSize = 30
): Promise<MessageWithSender[]> {
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      *,
      sender:sender_id(id, username, display_name, avatar_url)
    `
    )
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  const messages = data as unknown as MessageWithSender[]
  return messages.reverse()
}

export async function sendMessage(
  senderId: string,
  conversationId: string,
  content: string | null,
  file?: File
): Promise<MessageWithSender> {
  let mediaUrl: string | null = null
  let mediaType: string | null = null
  let voiceDuration: number | null = null

  if (file) {
    const ext = file.name.split('.').pop()
    const path = `${conversationId}/${crypto.randomUUID()}.${ext}`
    const bucket = file.type.startsWith('audio/')
      ? 'message-media'
      : 'message-media'
    mediaUrl = await uploadFile(bucket, path, file)
    mediaType = file.type.startsWith('audio/') ? 'audio' : 'image'
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      conversation_id: conversationId,
      content,
      media_url: mediaUrl,
      media_type: mediaType,
      voice_duration: voiceDuration,
      status: 'sent',
    })
    .select(
      `
      *,
      sender:sender_id(id, username, display_name, avatar_url)
    `
    )
    .single()

  if (error) throw error
  return data as unknown as MessageWithSender
}

export async function markAsDelivered(
  messageId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'delivered' })
    .eq('id', messageId)
    .eq('status', 'sent')
  if (error) throw error
}

export async function markAsSeen(
  messageIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'seen' })
    .in('id', messageIds)
  if (error) throw error
}

export async function updateLastRead(
  userId: string,
  conversationId: string
): Promise<void> {
  const { error } = await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('conversation_id', conversationId)
  if (error) throw error
}

export function subscribeToConversation(
  conversationId: string,
  callback: (message: MessageWithSender) => void
) {
  return supabase
    .channel(`messages:${conversationId}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as MessageWithSender)
      }
    )
    .subscribe()
}

export function subscribeToTyping(
  conversationId: string,
  userId: string,
  callback: (typingUserId: string) => void
) {
  return supabase
    .channel(`typing:${conversationId}`)
    .on(
      'broadcast',
      { event: 'typing' },
      (payload) => {
        if (payload.payload.userId !== userId) {
          callback(payload.payload.userId)
        }
      }
    )
    .subscribe()
}

export async function emitTyping(
  conversationId: string,
  userId: string
): Promise<void> {
  await supabase.channel(`typing:${conversationId}`).send({
    type: 'broadcast',
    event: 'typing',
    payload: { userId },
  })
}

export async function searchMessages(
  conversationId: string,
  query: string
): Promise<MessageWithSender[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      *,
      sender:sender_id(id, username, display_name, avatar_url)
    `
    )
    .eq('conversation_id', conversationId)
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data as unknown as MessageWithSender[]
}

export async function searchUsers(
  query: string
): Promise<{ id: string; username: string; display_name: string; avatar_url: string | null }[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data
}
