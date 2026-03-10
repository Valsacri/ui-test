"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { X, Camera, ImageIcon, SmilePlus, Plus, Send } from "lucide-react"
import { cn, resolvePostImageUrl } from "@/lib/utils"
import { storiesService } from "@/lib/services/stories"
import { messagesService } from "@/lib/services/messages"
import { toast } from "sonner"

export interface StoryReplyNotification {
  id: string
  storyId: string
  message: string
  senderId: string
  senderName: string
  senderAvatar: string | null
}

interface StoryReplyModalProps {
  open: boolean
  onClose: () => void
  notification: StoryReplyNotification | null
}

/**
 * Modal that shows a story reply like the reference: "Replied to your story",
 * story preview, message bubble, and reply input.
 */
export function StoryReplyModal({
  open,
  onClose,
  notification,
}: StoryReplyModalProps) {
  const [storyPreviewUrl, setStoryPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)

  const handleSendDm = useCallback(async () => {
    const text = replyText.trim()
    if (!text || !notification?.senderId || sending) return
    setSending(true)
    try {
      await messagesService.sendDirectMessage({
        recipientId: notification.senderId,
        content: text,
      })
      setReplyText("")
      toast.success("Message sent")
      onClose()
    } catch (e) {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }, [notification?.senderId, replyText, sending, onClose])

  useEffect(() => {
    if (!open || !notification?.storyId) {
      setStoryPreviewUrl(null)
      setReplyText("")
      return
    }
    let cancelled = false
    setLoading(true)
    storiesService
      .getStoryById(notification.storyId)
      .then((story) => {
        if (!cancelled && story?.mediaUrl) setStoryPreviewUrl(story.mediaUrl)
      })
      .catch(() => {
        if (!cancelled) setStoryPreviewUrl(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, notification?.storyId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold text-foreground">Replied to your story</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-auto p-4">
        {/* Story preview - vertical rounded thumbnail */}
        <div className="flex justify-center">
          <div className="relative h-[280px] w-[160px] overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
            {loading ? (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Loading…
              </div>
            ) : storyPreviewUrl ? (
              <Image
                src={resolvePostImageUrl(storyPreviewUrl)}
                alt="Story"
                fill
                className="object-cover"
                sizes="160px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Story unavailable
              </div>
            )}
          </div>
        </div>

        {/* Reply message bubble */}
        {notification && (
          <div className="mt-4 flex items-start gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
              {notification.senderAvatar ? (
                <Image
                  src={resolvePostImageUrl(notification.senderAvatar)}
                  alt={notification.senderName}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                  {notification.senderName?.slice(0, 2).toUpperCase() ?? "?"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="inline-block max-w-[85%] rounded-2xl rounded-tl-md bg-muted px-4 py-2.5">
                <p className="text-sm text-foreground">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Spacer so input stays at bottom */}
        <div className="flex-1" />
      </div>

      {/* Message input bar - like the reference */}
      <div className="shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            aria-label="Camera"
          >
            <Camera className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Message..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendDm()
              }
            }}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            )}
          />
          {replyText.trim() ? (
            <button
              type="button"
              onClick={handleSendDm}
              disabled={sending}
              className="shrink-0 rounded-full bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Voice message"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Emoji"
              >
                <SmilePlus className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="More"
              >
                <Plus className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
