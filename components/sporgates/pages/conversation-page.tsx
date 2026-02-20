"use client"

import { useMemo, useState, useEffect } from "react"
import { ArrowLeft, Send, Phone, Video, MoreVertical, Loader2 } from "lucide-react"
import { messagesService, authService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"

interface ConversationPageProps {
  conversationId: string
  onNavigate: (page: PageRoute) => void
}

export function ConversationPage({ conversationId, onNavigate }: ConversationPageProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [conversationInfo, setConversationInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentUser = useMemo(() => authService.getCurrentUser(), [])

  useEffect(() => {
    if (!conversationId) return
    setIsLoading(true)

    messagesService.getMessages(conversationId).then((data) => {
      if (Array.isArray(data)) {
        setMessages(data)
      }
    }).catch(() => {
      setMessages([])
    }).finally(() => setIsLoading(false))

    // Try to get conversation info from conversations list
    if (currentUser?.id) {
      messagesService.getConversations(currentUser.id).then((convos) => {
        if (Array.isArray(convos)) {
          const convo = convos.find((c: any) => c.id === conversationId)
          if (convo) setConversationInfo(convo)
        }
      }).catch(() => { })
    }
  }, [conversationId, currentUser?.id])

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser?.id) return

    try {
      const sent = await messagesService.sendMessage({
        conversationId,
        senderId: currentUser.id,
        content: message.trim(),
      })
      if (sent) {
        setMessages((prev) => [...prev, sent])
        setMessage("")
      }
    } catch {
      // Handle silently for now
    }
  }

  const convoName = conversationInfo?.name || "Conversation"
  const convoAvatar = conversationInfo?.avatar || convoName.charAt(0)
  const isOnline = conversationInfo?.online ?? false

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("messages")}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
            {convoAvatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{convoName}</p>
            <p className="text-[10px] text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-muted">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </button>
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-muted">
            <Video className="h-4 w-4 text-muted-foreground" />
          </button>
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-muted">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No messages yet. Say hi!</p>
          </div>
        ) : (
          messages.map((item: any) => {
            const isOwn = item.senderId === currentUser?.id || item.isOwn
            return (
              <div key={item.id} className={isOwn ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    isOwn
                      ? "max-w-[70%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
                      : "max-w-[70%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-foreground"
                  }
                >
                  <p className="text-sm">{item.content || item.text}</p>
                  <p className="mt-1 text-right text-[10px] text-muted-foreground">
                    {item.time || (item.createdAt ? new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "")}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message..."
            className="h-10 flex-1 rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
