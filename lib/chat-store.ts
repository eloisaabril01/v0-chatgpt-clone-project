import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Message } from "./types"

interface Chat {
  title: string
  messages: Message[]
}

interface ChatStore {
  chats: Record<string, Chat>
  currentChat: string | null
  createChat: (id: string) => void
  setCurrentChat: (id: string) => void
  addMessage: (chatId: string, message: Message) => void
  updateChatTitle: (chatId: string, title: string) => void
  deleteChat: (chatId: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: {},
      currentChat: null,

      createChat: (id) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [id]: { title: "New Chat", messages: [] },
          },
          currentChat: id,
        })),

      setCurrentChat: (id) => set({ currentChat: id }),

      addMessage: (chatId, message) =>
        set((state) => {
          // Only update if the chat exists
          if (!state.chats[chatId]) return state

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages: [...state.chats[chatId].messages, message],
              },
            },
          }
        }),

      updateChatTitle: (chatId, title) =>
        set((state) => {
          // Only update if the chat exists and title is different
          if (!state.chats[chatId] || state.chats[chatId].title === title) return state

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                title,
              },
            },
          }
        }),

      deleteChat: (chatId) =>
        set((state) => {
          const { [chatId]: _, ...remainingChats } = state.chats
          return {
            chats: remainingChats,
            currentChat: state.currentChat === chatId ? null : state.currentChat,
          }
        }),
    }),
    {
      name: "chat-store",
    },
  ),
)
