"use client"

import { useState } from "react"
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react"
import { conversations } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function MessagesPage() {
  const [selectedConvo, setSelectedConvo] = useState<string | null>("1")
  const [message, setMessage] = useState("")

  const activeConvo = conversations.find((c) => c.id === selectedConvo)

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
          {conversations.map((convo) => (
            <button
              type="button"
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted",
                selectedConvo === convo.id && "bg-muted"
              )}
            >
              <div className="relative">
                <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white">
                  {convo.avatar}
                </div>
                {convo.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{convo.name}</p>
                  <span className="text-[10px] text-muted-foreground">{convo.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                  {convo.unread}
                </span>
              )}
            </button>
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
                  {activeConvo.avatar}
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
                  <p className="mt-1 text-right text-[10px] text-muted-foreground">{activeConvo.time}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5">
                  <p className="text-sm text-primary-foreground">Sounds great! Looking forward to it.</p>
                  <p className="mt-1 text-right text-[10px] text-primary-foreground/70">Just now</p>
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
