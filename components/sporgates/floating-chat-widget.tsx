"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { X, Minus, Send } from "lucide-react"
import { cn, resolvePostImageUrl } from "@/lib/utils"
import { messagesService } from "@/lib/services/messages"
import { toast } from "sonner"

export interface FloatingChatUser {
  id: string
  name: string
  avatar: string | null
  /** When opened from story reply, show this message as context */
  initialMessage?: string
}

interface FloatingChatWidgetProps {
  open: boolean
  onClose: () => void
  user: FloatingChatUser | null
}

/**
 * Facebook-style floating chat in the bottom-right. Opens when user clicks a story reply notification.
 */
export function FloatingChatWidget({ open, onClose, user }: FloatingChatWidgetProps) {
  const [minimized, setMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const handleSend = useCallback(async () => {
    const text = message.trim()
    if (!text || !user?.id || sending) return
    setSending(true)
    try {
      await messagesService.sendDirectMessage({
        recipientId: user.id,
        content: text,
      })
      setMessage("")
      toast.success("Message sent")
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }, [user?.id, message, sending])

  if (!open || !user) return null

  const avatarUrl = user.avatar ? resolvePostImageUrl(user.avatar) : null

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-card shadow-lg transition-transform hover:scale-105"
        aria-label="Expand chat"
      >
        {avatarUrl ? (
          <span className="relative block h-full w-full">
            <Image src={avatarUrl} alt={user.name} fill className="object-cover" sizes="56px" />
          </span>
        ) : (
          <span className="text-lg font-bold text-primary">
            {user.name?.slice(0, 2).toUpperCase() || "?"}
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[90] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
        "max-h-[480px]"
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {avatarUrl ? (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
              <Image src={avatarUrl} alt={user.name} fill className="object-cover" sizes="36px" />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.name?.slice(0, 2).toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-[10px] text-muted-foreground">Replied to your story</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Context: their reply */}
      {user.initialMessage && (
        <div className="shrink-0 border-b border-border bg-muted/20 px-3 py-2">
          <p className="text-[10px] font-medium text-muted-foreground">Replied to your story</p>
          <div className="mt-1 rounded-lg rounded-tl-md bg-muted px-3 py-2">
            <p className="text-sm text-foreground">{user.initialMessage}</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="shrink-0 rounded-full bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
