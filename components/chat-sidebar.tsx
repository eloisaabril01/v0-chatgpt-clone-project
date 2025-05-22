"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, PlusIcon, Trash2, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/chat-store"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
}

const ChatSidebar = ({ isOpen, onClose, onNewChat }: ChatSidebarProps) => {
  const router = useRouter()
  const { chats, currentChat, deleteChat } = useChatStore()
  const [mounted, setMounted] = useState(false)

  // Use useCallback to memoize the handler
  const handleChatSelect = useCallback(
    (chatId: string) => {
      router.push(`/?id=${chatId}`)
      onClose()
    },
    [router, onClose],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const chatEntries = Object.entries(chats).map(([id, chat]) => ({
    id,
    title: chat.title || "New Chat",
    messages: chat.messages,
  }))

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)

    // If we're deleting the current chat, navigate to a different one
    if (chatId === currentChat) {
      const remainingChats = Object.keys(chats).filter((id) => id !== chatId)
      if (remainingChats.length > 0) {
        router.push(`/?id=${remainingChats[0]}`)
      } else {
        onNewChat()
      }
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Nav's GPT
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chatEntries.length > 0 ? (
            <div className="space-y-1">
              {chatEntries.map((chat) => (
                <motion.div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-800 group",
                    currentChat === chat.id && "bg-gray-800 border-l-2 border-purple-500",
                  )}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="h-4 w-4 flex-shrink-0 text-purple-400" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 hover:opacity-100 h-8 w-8 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete chat</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No chats yet</div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          Nav's GPT © {new Date().getFullYear()}
        </div>
      </motion.div>
    </>
  )
}

export default ChatSidebar
