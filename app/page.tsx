"use client"

import { useEffect, useState, Suspense } from "react"
import { nanoid } from "nanoid"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"

import ChatWindow from "@/components/chat-window"
import ChatSidebar from "@/components/chat-sidebar"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/chat-store"
import LoadingMessage from "@/components/loading-message"
import Logo3D from "@/components/logo-3d"

export default function Home() {
  const { chats, createChat, currentChat, setCurrentChat } = useChatStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Initialize chat if none exists
    if (Object.keys(chats).length === 0) {
      const newChatId = nanoid()
      createChat(newChatId)
      setCurrentChat(newChatId)
    } else if (!currentChat) {
      setCurrentChat(Object.keys(chats)[0])
    }

    return () => clearTimeout(timer)
  }, [])

  const handleNewChat = () => {
    const newChatId = nanoid()
    createChat(newChatId)
    setCurrentChat(newChatId)
    setIsMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <LoadingMessage />
      </div>
    )
  }

  return (
    <main className="flex h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <ChatSidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        onNewChat={handleNewChat}
      />

      <motion.div
        className="flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="hidden md:block h-10 w-10">
              <Suspense fallback={<div className="h-10 w-10 bg-purple-600 rounded-full"></div>}>
                <Logo3D />
              </Suspense>
            </div>

            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Nav's AI
            </h1>
          </div>

          <Button
            variant="outline"
            onClick={handleNewChat}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {currentChat && <ChatWindow chatId={currentChat} />}
      </motion.div>
    </main>
  )
}