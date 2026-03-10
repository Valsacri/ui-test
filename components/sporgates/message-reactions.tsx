"use client"

import { useState, useRef, useEffect } from "react"
import { Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import { messagesService } from "@/lib/services/messages"

const REACTION_EMOJIS = ["❤️", "😂", "😮", "😢", "😠", "👍"]

interface MessageReactionsProps {
  conversationId: string
  messageId: string
  reactions?: Record<string, string[]> | null
  currentUserId?: string
  onReactionUpdate: (updated: { id: string; reactions?: Record<string, string[]> }) => void
  /** Align picker and reactions (e.g. for own message align right) */
  align?: "left" | "right"
}

export function MessageReactions({
  conversationId,
  messageId,
  reactions,
  currentUserId,
  onReactionUpdate,
  align = "left",
}: MessageReactionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pickerOpen) return
    const close = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [pickerOpen])

  const handleReact = async (emoji: string) => {
    if (!currentUserId || loading) return
    setPickerOpen(false)
    setLoading(true)
    try {
      const updated = await messagesService.toggleReaction(conversationId, messageId, emoji)
      if (updated?.id) {
        onReactionUpdate({ id: updated.id, reactions: updated.reactions ?? undefined })
      }
    } finally {
      setLoading(false)
    }
  }

  const reactionEntries = reactions && typeof reactions === "object"
    ? Object.entries(reactions).filter(([, userIds]) => Array.isArray(userIds) && userIds.length > 0)
    : []

  return (
    <div className={align === "right" ? "flex flex-col items-end" : "flex flex-col items-start"}>
      <div className={cn("relative flex items-center gap-2", align === "right" && "flex-row-reverse")}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setPickerOpen((o) => !o)
          }}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="React"
        >
          <Smile className="h-5 w-5" />
        </button>
        {pickerOpen && (
          <div
            ref={pickerRef}
            className={cn(
              "absolute bottom-full z-10 mb-1 flex gap-1 rounded-2xl border border-border bg-card px-2.5 py-2 shadow-lg",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReact(emoji)}
                className="rounded-lg p-1.5 text-xl transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      {reactionEntries.length > 0 && (
        <div
          className={cn(
            "mt-1 flex flex-wrap items-center gap-1.5",
            align === "right" && "flex-row-reverse justify-end"
          )}
        >
          {reactionEntries.map(([emoji, userIds]) => (
            <span
              key={emoji}
              className="inline-flex items-center gap-0.5 rounded-full bg-muted/80 px-2 py-1 text-sm"
              title={userIds?.length ? `${emoji} ${userIds.length}` : emoji}
            >
              <span>{emoji}</span>
              {userIds && userIds.length > 1 && (
                <span className="text-[10px] text-muted-foreground">{userIds.length}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
