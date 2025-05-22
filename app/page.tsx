"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PlusIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { motion, AnimatePresence } from "framer-motion"

import ChatWindow from "@/components/chat-window"
import ChatSidebar from "@/components/chat-sidebar"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/chat-store"
import LoadingScene from "@/components/loading-scene"
import Logo3D from "@/components/logo-3d"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("id")
  const { chats, createChat, currentChat, setCurrentChat } = useChatStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for a better experience
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only run this effect when the component mounts or chatId changes
    if (!chatId && Object.keys(chats).length === 0) {
      // No chats exist yet, create a new one
      const newChatId = nanoid()
      createChat(newChatId)
      router.push(`/?id=${newChatId}`)
    } else if (!chatId && Object.keys(chats).length > 0) {
      // Use an existing chat
      const existingChatId = Object.keys(chats)[0]
      router.push(`/?id=${existingChatId}`)
    } else if (chatId && chats[chatId]) {
      // Valid chat ID, set as current
      setCurrentChat(chatId)
    } else if (chatId && !chats[chatId]) {
      // Invalid chat ID, create a new one
      const newChatId = nanoid()
      createChat(newChatId)
      router.push(`/?id=${newChatId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, router])

  const handleNewChat = () => {
    const newChatId = nanoid()
    createChat(newChatId)
    router.push(`/?id=${newChatId}`)
    setIsMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <Suspense fallback={<div>Loading 3D scene...</div>}>
          <LoadingScene />
        </Suspense>
      </div>
    )
  }

  return (
    <main className="flex h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <AnimatePresence>
        <ChatSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onNewChat={handleNewChat} />
      </AnimatePresence>

      <motion.div
        className="flex flex-col flex-1 h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>

            <div className="hidden md:block h-10 w-10">
              <Suspense fallback={<div className="h-10 w-10 bg-purple-600 rounded-full"></div>}>
                <Logo3D />
              </Suspense>
            </div>

            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Nav's GPT
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
