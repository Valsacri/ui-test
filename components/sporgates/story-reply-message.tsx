"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { CheckCheck } from "lucide-react"
import { storiesService } from "@/lib/services/stories"
import { resolvePostImageUrl, formatMessageTime, cn } from "@/lib/utils"
import { StoryViewer } from "@/components/sporgates/story-viewer"
import { MessageReactions } from "@/components/sporgates/message-reactions"
import type { StoryDto } from "@/lib/types/story"

export interface StoryPreviewData {
  id: string
  mediaUrl: string
  mediaType?: string
  authorId?: string
  authorName?: string
  authorAvatar?: string
}

interface StoryReplyMessageProps {
  message: {
    id: string
    content?: string
    text?: string
    createdAt: string | number[] | undefined
    senderId?: string
    referenceId?: string
    referenceType?: string
    senderName?: string
    reactions?: Record<string, string[]> | null
    read?: boolean
  }
  isOwn: boolean
  senderAvatarUrl?: string | null
  currentUserId?: string
  /** When provided, used immediately so story preview is already loaded with messages */
  preloadedPreview?: StoryPreviewData | null
  conversationId?: string
  onReactionUpdate?: (updated: { id: string; reactions?: Record<string, string[]> }) => void
}

export function StoryReplyMessage({ message, isOwn, senderAvatarUrl, currentUserId, preloadedPreview, conversationId, onReactionUpdate }: StoryReplyMessageProps) {
  const [preview, setPreview] = useState<StoryPreviewData | null>(preloadedPreview ?? null)
  const [viewerState, setViewerState] = useState<{ stories: StoryDto[]; initialIndex: number } | null>(null)
  const storyId = message.referenceType === "STORY_REPLY" || message.referenceType === "story_reply"
    ? message.referenceId
    : null

  useEffect(() => {
    if (preloadedPreview) {
      setPreview(preloadedPreview)
      return
    }
    if (!storyId) return
    let cancelled = false
    storiesService
      .getStoryPreview(storyId)
      .then((res) => {
        if (!cancelled && res?.mediaUrl) {
          setPreview({
            id: res.id ?? storyId,
            mediaUrl: res.mediaUrl,
            mediaType: res.mediaType,
            authorId: res.authorId,
            authorName: res.authorName,
            authorAvatar: res.authorAvatar,
          })
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [storyId, preloadedPreview])

  const openStoryViewer = useCallback(async () => {
    if (!preview?.authorId) return
    try {
      const stories = await storiesService.getStoriesByUser(preview.authorId)
      if (stories.length === 0) return
      const index = stories.findIndex((s) => s.id === (preview.id || storyId))
      const initialIndex = index >= 0 ? index : 0
      setViewerState({ stories, initialIndex })
    } catch {
      // e.g. user has no stories anymore
    }
  }, [preview?.authorId, preview?.id, storyId])

  const content = message.content || message.text || ""
  const replyLabel = isOwn ? "You replied to their story" : "Replied to your story"

  return (
    <>
      <div className={isOwn ? "flex justify-end" : "flex justify-start"}>
        <div
          className={cn(
            "w-fit max-w-[70%] min-w-0 rounded-2xl border border-border/50 px-4 py-3 bg-transparent",
            isOwn
              ? "rounded-br-md text-foreground"
              : "rounded-bl-md text-foreground"
          )}
        >
          <p className="text-xs font-medium opacity-90">{replyLabel}</p>

          {/* Clickable story card – same style as home page story section */}
          {preview && (
            <button
              type="button"
              onClick={openStoryViewer}
              className="relative mt-2 flex h-[140px] w-[88px] shrink-0 flex-col overflow-hidden rounded-xl transition-transform active:scale-[0.98]"
            >
              {preview.mediaType === "VIDEO" || /\.(mp4|webm|mov)$/i.test(preview.mediaUrl) ? (
                <video
                  src={`${resolvePostImageUrl(preview.mediaUrl)}#t=0.1`}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={resolvePostImageUrl(preview.mediaUrl)}
                  alt="Story"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 z-10 flex h-10 items-center justify-center bg-gradient-to-t from-black/70 to-transparent">
                <span className="truncate px-1 text-center text-[10px] font-medium text-white drop-shadow">
                  {preview.authorName || "Story"}
                </span>
              </div>
            </button>
          )}

          {/* Reply message under the card */}
          <div className="mt-3 flex items-end gap-2">
            {!isOwn && senderAvatarUrl && (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={senderAvatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-snug">{content}</p>
              <p className="mt-2 flex items-center justify-end gap-2 text-xs tabular-nums text-muted-foreground">
                {formatMessageTime(message.createdAt)}
                {isOwn && (
                  <CheckCheck
                    className={message.read ? "h-5 w-5 shrink-0 text-secondary" : "h-5 w-5 shrink-0 text-muted-foreground"}
                    aria-label={message.read ? "Seen" : "Delivered"}
                  />
                )}
              </p>
              {conversationId && onReactionUpdate && (
                <MessageReactions
                  conversationId={conversationId}
                  messageId={message.id}
                  reactions={message.reactions}
                  currentUserId={currentUserId}
                  onReactionUpdate={onReactionUpdate}
                  align={isOwn ? "right" : "left"}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story viewer in portal when card is clicked */}
      {typeof document !== "undefined" &&
        viewerState &&
        createPortal(
          <StoryViewer
            stories={viewerState.stories}
            initialIndex={viewerState.initialIndex}
            currentUserId={currentUserId}
            onClose={() => setViewerState(null)}
            onView={(id) => storiesService.recordView(id).catch(() => {})}
            onToggleLike={(id) => storiesService.toggleLike(id)}
            onReply={async (id, text) => {
              await storiesService.createReply(id, text)
            }}
            onNextUser={() => setViewerState(null)}
            onPrevUser={() => setViewerState(null)}
          />,
          document.body
        )}
    </>
  )
}
