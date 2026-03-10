"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Send, Phone, Video, MoreVertical, Pencil, Check, X, CheckCheck } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { messagesService, authService, userService } from "@/lib/services"
import { subscribeToConversation, sendMessageOverWs, type MessagePayload } from "@/lib/messaging-ws"
import { cn, resolvePostImageUrl, parseBackendDate, formatMessageTime, canEditMessage, isOnline, formatLastSeen } from "@/lib/utils"
import { ConversationLoadingSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { StoryReplyMessage, type StoryPreviewData } from "@/components/sporgates/story-reply-message"
import { MessageReactions } from "@/components/sporgates/message-reactions"
import { storiesService } from "@/lib/services/stories"
import { useRefetchUnreadMessagesCount } from "@/lib/message-count-context"
import type { PageRoute } from "@/lib/navigation"

interface ConversationPageProps {
  conversationId: string
  onNavigate: (page: PageRoute) => void
}

export function ConversationPage({ conversationId, onNavigate }: ConversationPageProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [conversationInfo, setConversationInfo] = useState<any>(null)
  const [storyPreviews, setStoryPreviews] = useState<Record<string, StoryPreviewData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const messageIdsRef = useRef<Set<string>>(new Set())
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const messagesContentRef = useRef<HTMLDivElement>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const currentUser = useMemo(() => authService.getCurrentUser(), [])
  const refetchUnreadMessagesCount = useRefetchUnreadMessagesCount()

  const scrollToLatest = useCallback(() => {
    const el = messagesScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  // Scroll to bottom when message list or content height changes (covers story reply preview loading)
  useEffect(() => {
    if (messages.length === 0) return
    scrollToLatest()
  }, [messages.length, messages, scrollToLatest])

  // ResizeObserver: whenever message content height changes (e.g. story reply card loads), scroll to bottom
  useEffect(() => {
    const content = messagesContentRef.current
    if (!content) return
    const ro = new ResizeObserver(() => scrollToLatest())
    ro.observe(content)
    return () => ro.disconnect()
  }, [messages.length, scrollToLatest])

  // Presence: report activity so we show as online while viewing conversation
  useEffect(() => {
    const userId = currentUser?.id
    if (!userId) return
    const ping = () => userService.reportActivity(userId).catch(() => {})
    ping()
    const interval = setInterval(ping, 90 * 1000)
    const onVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") ping()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [currentUser?.id])

  // Initial load: messages + conversation info + story previews for reply messages; then show content
  useEffect(() => {
    if (!conversationId) return
    setIsLoading(true)
    messageIdsRef.current = new Set()
    setStoryPreviews({})

    messagesService.markAsRead(conversationId).then(() => refetchUnreadMessagesCount?.()).catch(() => {})

    const INITIAL_MESSAGE_LIMIT = 50
    Promise.all([
      messagesService.getMessages(conversationId, INITIAL_MESSAGE_LIMIT),
      currentUser?.id ? messagesService.getConversations(currentUser.id) : Promise.resolve([]),
    ]).then(([messagesData, convos]) => {
      const messagesList = Array.isArray(messagesData) ? messagesData : []
      const storyIds = [
        ...new Set(
          messagesList
            .filter((m: any) => (m.referenceType === "STORY_REPLY" || m.referenceType === "story_reply") && m.referenceId)
            .map((m: any) => m.referenceId)
        ),
      ] as string[]
      return Promise.all(
        storyIds.map((id) =>
          storiesService.getStoryPreview(id).then((res) => ({ id, res })).catch(() => ({ id, res: null }))
        )
      ).then((results) => {
        const previewMap: Record<string, StoryPreviewData> = {}
        results.forEach(({ id, res }) => {
          if (res?.mediaUrl) {
            previewMap[id] = {
              id: res.id ?? id,
              mediaUrl: res.mediaUrl,
              mediaType: res.mediaType,
              authorId: res.authorId,
              authorName: res.authorName,
              authorAvatar: res.authorAvatar,
            }
          }
        })
        setStoryPreviews(previewMap)
        setMessages(messagesList)
        messagesList.forEach((m: any) => m.id && messageIdsRef.current.add(m.id))
        if (currentUser?.id && Array.isArray(convos)) {
          const convo = convos.find((c: any) => c.id === conversationId)
          if (convo) setConversationInfo(convo)
        }
      })
    }).catch(() => {
      setMessages([])
    }).finally(() => setIsLoading(false))
  }, [conversationId, currentUser?.id])

  // Real-time: subscribe to WebSocket for this conversation
  useEffect(() => {
    if (!conversationId || !currentUser?.id) return
    const unsub = subscribeToConversation(
      conversationId,
      (msg: MessagePayload) => {
        if (messageIdsRef.current.has(msg.id)) {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
          )
          return
        }
        messageIdsRef.current.add(msg.id)
        setMessages((prev) => [...prev, { ...msg }])
        // Recipient is already viewing this conversation → mark as read so sender sees orange ticks instantly
        if (msg.senderId !== currentUser?.id) {
          messagesService.markAsRead(conversationId).then(() => refetchUnreadMessagesCount?.()).catch(() => {})
        }
      },
      undefined,
      (messageIds) => {
        setMessages((prev) =>
          prev.map((m) => (messageIds.includes(m.id) ? { ...m, read: true } : m))
        )
      }
    )
    return unsub
  }, [conversationId, currentUser?.id])

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser?.id) return
    const content = message.trim()
    setMessage("")

    const sentOverWs = sendMessageOverWs(conversationId, {
      senderId: currentUser.id,
      senderName: currentUser.firstName || currentUser.username || "",
      content,
    })
    if (sentOverWs) return

    try {
      const sent = await messagesService.sendMessage({
        conversationId,
        senderId: currentUser.id,
        content,
      })
      if (sent && !messageIdsRef.current.has((sent as any).id)) {
        messageIdsRef.current.add((sent as any).id)
        setMessages((prev) => [...prev, sent as any])
      }
    } catch {
      toast.error("Failed to send message. Please try again.")
      setMessage(content)
    }
  }

  const handleReactionUpdate = useCallback(
    (updated: { id: string; reactions?: Record<string, string[]> }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, reactions: updated.reactions } : m))
      )
    },
    []
  )

  const handleMessageUpdate = useCallback((updated: { id: string; content?: string; editedAt?: string | number[] | null }) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
    )
  }, [])

  const handleStartEdit = useCallback((item: any) => {
    setEditingMessageId(item.id)
    setEditingContent(item.content || item.text || "")
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessageId || !editingContent.trim() || !currentUser?.id) return
    try {
      const updated = await messagesService.editMessage(conversationId, editingMessageId, editingContent.trim())
      if (updated?.id) handleMessageUpdate({ id: updated.id, content: updated.content, editedAt: updated.editedAt })
      setEditingMessageId(null)
      setEditingContent("")
    } catch {
      toast.error("Could not edit message. It may be too old to edit.")
    }
  }, [conversationId, editingMessageId, editingContent, currentUser?.id, handleMessageUpdate])

  const handleCancelEdit = useCallback(() => {
    setEditingMessageId(null)
    setEditingContent("")
  }, [])

  const currentUserId = currentUser?.id
  const participantIds = conversationInfo?.participantIds || []
  const otherId = participantIds.find((id: string) => id !== currentUserId) || participantIds[0]
  const participantNames = conversationInfo?.participantNames || {}
  const participantAvatars = conversationInfo?.participantAvatars || {}
  const convoName = otherId ? (participantNames[otherId] || "Conversation") : "Conversation"
  const convoAvatarUrl = otherId && participantAvatars[otherId] ? resolvePostImageUrl(participantAvatars[otherId]) : null
  const otherLastActiveAt = otherId ? conversationInfo?.participantLastActiveAt?.[otherId] : undefined
  const isOnlineStatus = isOnline(otherLastActiveAt)
  const lastSeenLabel = formatLastSeen(otherLastActiveAt).replace(/^Last seen /, "") || "Offline"

  if (isLoading) {
    return <ConversationLoadingSkeleton />
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("messages")}
            className="rounded-full p-2 transition-colors hover:bg-muted shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {convoAvatarUrl ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border/50">
              <Image src={convoAvatarUrl} alt={convoName} fill className="object-cover" sizes="40px" />
            </div>
          ) : (
            <div className="gradient-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-border/50">
              {convoName.charAt(0) || "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">{convoName}</p>
            <p className="text-xs text-muted-foreground">
              {isOnlineStatus ? "Online" : lastSeenLabel}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" className="rounded-full p-2.5 transition-colors hover:bg-muted" aria-label="Call">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </button>
          <button type="button" className="rounded-full p-2.5 transition-colors hover:bg-muted" aria-label="Video">
            <Video className="h-4 w-4 text-muted-foreground" />
          </button>
          <button type="button" className="rounded-full p-2.5 transition-colors hover:bg-muted" aria-label="Options">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div ref={messagesScrollRef} className="flex-1 overflow-y-auto bg-muted/25 px-4 py-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No messages yet. Say hi!</p>
          </div>
        ) : (
          <div ref={messagesContentRef} className="flex flex-col gap-5">
          {messages.map((item: any) => {
            const isOwn = item.senderId === currentUser?.id || item.isOwn
            const isStoryReply =
              (item.referenceType === "STORY_REPLY" || item.referenceType === "story_reply") &&
              item.referenceId
            if (isStoryReply) {
              return (
                <StoryReplyMessage
                  key={item.id}
                  message={item}
                  isOwn={isOwn}
                  senderAvatarUrl={!isOwn ? convoAvatarUrl : undefined}
                  currentUserId={currentUserId}
                  preloadedPreview={item.referenceId ? storyPreviews[item.referenceId] : undefined}
                  conversationId={conversationId}
                  onReactionUpdate={handleReactionUpdate}
                />
              )
            }
            const isEditing = editingMessageId === item.id
            const showEditButton = isOwn && canEditMessage(item, currentUserId ?? "")

            return (
              <div key={item.id} className={isOwn ? "flex justify-end" : "flex justify-start"}>
                {!isOwn && convoAvatarUrl && (
                  <div className="relative mr-2 h-8 w-8 shrink-0 self-end overflow-hidden rounded-full bg-muted">
                    <Image
                      src={convoAvatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <div className={isOwn ? "flex flex-col items-end" : "flex flex-col items-start"}>
                  {isEditing ? (
                    <div className="w-fit max-w-[70%] min-w-[160px] rounded-2xl rounded-br-md border border-border bg-primary px-5 py-3">
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit()
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                        className="w-full min-w-[120px] rounded bg-transparent text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/70"
                        placeholder="Message..."
                        autoFocus
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded p-2 text-primary-foreground/80 hover:bg-primary-foreground/20"
                          aria-label="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={!editingContent.trim()}
                          className="rounded p-2 text-primary-foreground hover:bg-primary-foreground/20 disabled:opacity-50"
                          aria-label="Save"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={
                          isOwn
                            ? "w-fit max-w-[75%] min-w-[160px] rounded-2xl rounded-br-md bg-primary px-5 py-3.5 text-primary-foreground shadow-md"
                            : "w-fit max-w-[75%] min-w-[160px] rounded-2xl rounded-bl-md bg-card px-5 py-3.5 text-foreground shadow-sm ring-1 ring-border/50"
                        }
                      >
                        {item.editedAt != null && (
                          <p className="text-xs opacity-80">Edited</p>
                        )}
                        <p className="text-[15px] leading-snug">{item.content || item.text}</p>
                      </div>
                      <div className={cn("mt-0.5 flex flex-wrap items-center gap-2", isOwn && "justify-end")}>
                        <MessageReactions
                          conversationId={conversationId}
                          messageId={item.id}
                          reactions={item.reactions}
                          currentUserId={currentUserId}
                          onReactionUpdate={handleReactionUpdate}
                          align={isOwn ? "right" : "left"}
                        />
                        {showEditButton && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Edit message"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <p className={cn("mt-1 flex items-center gap-2 text-xs tabular-nums text-muted-foreground", isOwn ? "justify-end" : "justify-start")}>
                        {formatMessageTime(item.createdAt)}
                        {isOwn && (
                          <CheckCheck
                            className={item.read ? "h-4 w-4 shrink-0 text-secondary" : "h-4 w-4 shrink-0 text-muted-foreground"}
                            aria-label={item.read ? "Seen" : "Delivered"}
                          />
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card px-4 py-4 shrink-0">
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
            className="h-11 flex-1 rounded-2xl border border-border bg-muted/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-muted/80"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="gradient-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
