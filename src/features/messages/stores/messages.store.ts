import { create } from 'zustand'

interface MessagesStore {
  activeConversationId: string | null
  setActiveConversation: (id: string | null) => void
  typingUsers: Record<string, string[]> // conversationId -> userId[]
  setTypingUsers: (conversationId: string, users: string[]) => void
  addTypingUser: (conversationId: string, userId: string) => void
  removeTypingUser: (conversationId: string, userId: string) => void
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  typingUsers: {},
  setTypingUsers: (conversationId, users) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: users },
    })),
  addTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] ?? []
      if (current.includes(userId)) return state
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...current, userId],
        },
      }
    }),
  removeTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] ?? []
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: current.filter((id) => id !== userId),
        },
      }
    }),
}))
