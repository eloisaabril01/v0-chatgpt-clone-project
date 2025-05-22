import { MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4", isUser ? "justify-start" : "justify-start")}>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          isUser
            ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
            : "bg-gradient-to-br from-purple-400 to-pink-600 text-white",
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </div>

      <div className="flex-1 space-y-2">
        <div className="font-medium">{isUser ? "You" : "Nav's GPT"}</div>
        <div className="prose prose-invert max-w-none">{message.content}</div>
      </div>
    </div>
  )
}
