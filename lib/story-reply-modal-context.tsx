"use client"

import React, { createContext, useCallback, useContext, useState } from "react"
import { FloatingChatWidget } from "@/components/sporgates/floating-chat-widget"

export interface StoryReplyNotification {
  id: string
  storyId: string
  message: string
  senderId: string
  senderName: string
  senderAvatar: string | null
}

interface StoryReplyModalContextValue {
  openStoryReply: (notification: StoryReplyNotification) => void
  closeStoryReply: () => void
}

const StoryReplyModalContext = createContext<StoryReplyModalContextValue | null>(null)

export function StoryReplyModalProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<StoryReplyNotification | null>(null)

  const openStoryReply = useCallback((n: StoryReplyNotification) => {
    setNotification(n)
  }, [])

  const closeStoryReply = useCallback(() => {
    setNotification(null)
  }, [])

  const floatingUser = notification
    ? {
        id: notification.senderId,
        name: notification.senderName,
        avatar: notification.senderAvatar,
        initialMessage: notification.message,
      }
    : null

  return (
    <StoryReplyModalContext.Provider value={{ openStoryReply, closeStoryReply }}>
      {children}
      <FloatingChatWidget
        open={!!notification}
        onClose={closeStoryReply}
        user={floatingUser}
      />
    </StoryReplyModalContext.Provider>
  )
}

export function useStoryReplyModal(): StoryReplyModalContextValue {
  const ctx = useContext(StoryReplyModalContext)
  if (!ctx) {
    throw new Error("useStoryReplyModal must be used within StoryReplyModalProvider")
  }
  return ctx
}
