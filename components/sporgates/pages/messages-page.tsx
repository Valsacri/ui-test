"use client"

import { useState, useEffect } from "react"
import { Search, Send, Phone, Video, MoreVertical, Trash2, CheckCircle, MessageCircle } from "lucide-react"
import { MessageItemSkeleton } from "@/components/sporgates/ux/page-skeleton"
import type { PageRoute } from "@/lib/navigation"
import { messagesService, authService } from "@/lib/services"
import { cn } from "@/lib/utils"
import { ConversationItem } from "@/components/sporgates/conversation-item"
import { SwipeableCard } from "@/components/sporgates/ux/swipeable-card"

interface MessagesPageProps {
  onNavigate?: (page: PageRoute, id?: string) => void
}

export function MessagesPage({ onNavigate }: MessagesPageProps) {
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [conversationList, setConversationList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      setIsLoading(true)
      messagesService.getConversations(user.id).then((data) => {
        if (Array.isArray(data)) {
          setConversationList(data)
          if (data.length > 0) setSelectedConvo(data[0].id)
        }
      }).catch(() => {
        setConversationList([])
      }).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const parseRelativeTime = (value: string) => {
    const trimmed = value.trim()
    const minutesMatch = trimmed.match(/(\d+)m/)
    const hoursMatch = trimmed.match(/(\d+)h/)
    const daysMatch = trimmed.match(/(\d+)d/)
    const now = new Date()
    if (minutesMatch) return new Date(now.getTime() - Number(minutesMatch[1]) * 60000)
    if (hoursMatch) return new Date(now.getTime() - Number(hoursMatch[1]) * 3600000)
    if (daysMatch) return new Date(now.getTime() - Number(daysMatch[1]) * 86400000)
    return now
  }

  const activeConvo = conversationList.find((c) => c.id === selectedConvo)

  const getConversationTimestamp = (value: { time?: string; timestamp?: string }) => {
    if (value.timestamp) return new Date(value.timestamp)
    if (value.time) return parseRelativeTime(value.time)
    return new Date()
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)] p-4 space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <MessageItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (conversationList.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No conversations yet</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Start a conversation by connecting with other athletes or joining an activity.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)]">
      {/* Conversation List */}
      <div
        className={cn(
          "w-full shrink-0 border-r border-border md:w-80",
          selectedConvo ? "hidden md:block" : "block"
        )}
      >
        <div className="border-b border-border p-4">
          <h2 className="mb-3 text-lg font-bold text-foreground">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="h-9 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-y-auto">
          {conversationList.map((convo) => (
            <SwipeableCard
              key={convo.id}
              leftAction={{
                icon: CheckCircle,
                label: "Read",
                color: "text-green-700",
                bgColor: "bg-green-100",
                onAction: () =>
                  setConversationList((prev) =>
                    prev.map((item) => (item.id === convo.id ? { ...item, unread: 0 } : item))
                  ),
              }}
              rightAction={{
                icon: Trash2,
                label: "Delete",
                color: "text-red-700",
                bgColor: "bg-red-100",
                onAction: () =>
                  setConversationList((prev) => prev.filter((item) => item.id !== convo.id)),
              }}
            >
              <ConversationItem
                userName={convo.name}
                lastMessage={convo.lastMessage}
                timestamp={getConversationTimestamp(convo)}
                unread={convo.unread}
                isOnline={convo.online}
                verified={false}
                onClick={() => setSelectedConvo(convo.id)}
              />
            </SwipeableCard>
          ))}
        </div>
      </div>

      {/* Conversation View */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          !selectedConvo ? "hidden md:flex" : "flex"
        )}
      >
        {activeConvo ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedConvo(null)}
                  className="text-sm text-muted-foreground md:hidden"
                >
                  Back
                </button>
                <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
                  {activeConvo.avatar || activeConvo.name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{activeConvo.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {activeConvo.online ? "Online" : "Offline"}
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
                  <p className="text-sm text-foreground">{activeConvo.lastMessage}</p>
                  <p className="mt-1 text-right text-[10px] text-muted-foreground">{activeConvo.time || "Recently"}</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="h-10 flex-1 rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-opacity hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </button>
                {onNavigate && activeConvo && (
                  <button
                    type="button"
                    onClick={() => onNavigate("conversation", activeConvo.id)}
                    className="hidden rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted md:inline-flex"
                  >
                    Open Thread
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
