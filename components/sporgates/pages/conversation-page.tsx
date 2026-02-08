"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react"
import { conversations } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"

interface ConversationPageProps {
  conversationId: string
  onNavigate: (page: PageRoute) => void
}

const fallbackMessages = [
  { id: "m1", text: "See you at the game tonight!", isOwn: false, time: "2m ago" },
  { id: "m2", text: "Sounds great. I will bring the extra ball.", isOwn: true, time: "Just now" },
]

export function ConversationPage({ conversationId, onNavigate }: ConversationPageProps) {
  const conversation = conversations.find((item) => item.id === conversationId) || conversations[0]
  const [message, setMessage] = useState("")

  const messages = useMemo(() => {
    return fallbackMessages.map((item) => ({
      ...item,
      text: item.text.replace("game", conversation.name.split(" ")[0]),
    }))
  }, [conversation.name])

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
            {conversation.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{conversation.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {conversation.online ? "Online" : "Offline"}
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
        {messages.map((item) => (
          <div key={item.id} className={item.isOwn ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                item.isOwn
                  ? "max-w-[70%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
                  : "max-w-[70%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-foreground"
              }
            >
              <p className="text-sm">{item.text}</p>
              <p className="mt-1 text-right text-[10px] text-muted-foreground">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type a message..."
            className="h-10 flex-1 rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
