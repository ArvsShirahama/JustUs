export interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  website: string | null
  phone: string | null
  is_verified: boolean
  is_private: boolean
  theme_preference: 'light' | 'dark' | 'system'
  language: string
  notification_preferences: Record<string, boolean>
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  caption: string | null
  media_urls: string[]
  media_types: string[]
  location: string | null
  hashtags: string[]
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name: string | null
  created_at: string
  updated_at: string
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  last_read_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string | null
  media_url: string | null
  media_type: string | null
  voice_duration: number | null
  status: 'sending' | 'sent' | 'delivered' | 'seen'
  reply_to_id: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  actor_id: string
  type: 'follow' | 'like' | 'comment' | 'message' | 'call'
  reference_id: string | null
  reference_type: string | null
  is_read: boolean
  created_at: string
}

export interface Call {
  id: string
  caller_id: string
  callee_id: string
  type: 'voice' | 'video'
  status: 'missed' | 'completed' | 'declined' | 'cancelled'
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
}

export interface BlockedUser {
  id: string
  blocker_id: string
  blocked_id: string
  created_at: string
}

export interface SavedPost {
  id: string
  user_id: string
  post_id: string
  created_at: string
}
