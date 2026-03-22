"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Search, Send, Phone, Video, MoreVertical, MessageCircle, Pencil, Check, X, CheckCheck } from "lucide-react"
import { MessageItemSkeleton, ConversationLoadingSkeleton } from "@/components/sporgates/ux/page-skeleton"
import type { PageRoute } from "@/lib/navigation"
import { messagesService, authService, userService } from "@/lib/services"
import { cn, resolvePostImageUrl, parseBackendDate, formatMessageTime, canEditMessage, isAvatarImageUrl, isOnline, formatLastSeen } from "@/lib/utils"
import { ConversationItem } from "@/components/sporgates/conversation-item"
import { subscribeToUserMessages, subscribeToConversation, sendMessageOverWs, type MessagePayload } from "@/lib/messaging-ws"
import { toast } from "sonner"
import { StoryReplyMessage, type StoryPreviewData } from "@/components/sporgates/story-reply-message"
import { MessageReactions } from "@/components/sporgates/message-reactions"
import { storiesService } from "@/lib/services/stories"
import { useRefetchUnreadMessagesCount } from "@/lib/message-count-context"

interface MessagesPageProps {
  onNavigate?: (page: PageRoute, id?: string) => void
}

export function MessagesPage({ onNavigate }: MessagesPageProps) {
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [conversationList, setConversationList] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [storyPreviews, setStoryPreviews] = useState<Record<string, StoryPreviewData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const messageIdsRef = useRef<Set<string>>(new Set())
  const conversationIdsRef = useRef<Set<string>>(new Set())
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const messagesContentRef = useRef<HTMLDivElement>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [mutualFollows, setMutualFollows] = useState<Array<{ id: string; firstName?: string; lastName?: string; username?: string; profilePicture?: string; lastActiveAt?: string | number[] }>>([])
  const [openingChatWithId, setOpeningChatWithId] = useState<string | null>(null)
  const currentUser = useMemo(() => authService.getCurrentUser(), [])
  const refetchUnreadMessagesCount = useRefetchUnreadMessagesCount()
  const searchParams = useSearchParams()

  // When navigated to /messages?tab=<conversationId>, auto-select that conversation
  useEffect(() => {
    const convoId = searchParams?.get("tab")
    if (convoId && !selectedConvo) {
      setSelectedConvo(convoId)
    }
  }, [searchParams, selectedConvo])

  const scrollToLatest = useCallback(() => {
    const el = messagesScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  // Scroll to bottom when conversation or message list changes
  useEffect(() => {
    if (!selectedConvo || messages.length === 0) return
    scrollToLatest()
  }, [selectedConvo, messages.length, messages, scrollToLatest])

  // ResizeObserver: when message content height changes (e.g. story reply card loads), scroll to bottom
  useEffect(() => {
    if (!selectedConvo) return
    const content = messagesContentRef.current
    if (!content) return
    const ro = new ResizeObserver(() => scrollToLatest())
    ro.observe(content)
    return () => ro.disconnect()
  }, [selectedConvo, messages.length, scrollToLatest])

  const refetchConversations = useCallback((): Promise<void> => {
    const user = authService.getCurrentUser()
    if (!user?.id) return Promise.resolve()
    return messagesService.getConversations(user.id).then((data) => {
      if (Array.isArray(data)) {
        const mapped = data.map((c: any) => {
          const participantIds = c.participantIds || []
          const otherId = participantIds.find((id: string) => id !== user.id) || participantIds[0]
          const names = c.participantNames || {}
          const avatars = c.participantAvatars || {}
          const name = names[otherId] || "Unknown"
          const avatarUrl = avatars[otherId] ? resolvePostImageUrl(avatars[otherId]) : undefined
          const lastMessageAt = c.lastMessageAt
          const timestamp = parseBackendDate(lastMessageAt) || new Date()
          const unread = (c.unreadCounts && c.unreadCounts[user.id]) || 0
          const lastActiveAt = otherId ? c.participantLastActiveAt?.[otherId] : undefined
          return {
            id: c.id,
            name,
            avatar: avatarUrl,
            lastMessage: c.lastMessage || "",
            lastMessageAt,
            timestamp,
            timeLabel: formatMessageTime(lastMessageAt),
            unread,
            online: isOnline(lastActiveAt),
            lastActiveAt,
          }
        })
        setConversationList(mapped)
        conversationIdsRef.current = new Set(mapped.map((c: any) => c.id))
      }
    }).catch(() => {
      setConversationList([])
      conversationIdsRef.current = new Set()
    })
  }, [])

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      setIsLoading(true)
      Promise.all([
        refetchConversations(),
        userService.getMutualFollows(user.id).then(setMutualFollows).catch(() => setMutualFollows([])),
      ]).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [refetchConversations])

  // Presence: report activity so we show as online; ping every 90s and when tab becomes visible
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

  // Load latest 50 messages + story previews for reply messages, then show content
  useEffect(() => {
    if (!selectedConvo) {
      setMessages([])
      setStoryPreviews({})
      return
    }
    setIsLoadingMessages(true)
    messageIdsRef.current = new Set()
    const INITIAL_MESSAGE_LIMIT = 50
    messagesService
      .getMessages(selectedConvo, INITIAL_MESSAGE_LIMIT)
      .then((messagesData) => {
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
        })
      })
      .catch(() => setMessages([]))
      .finally(() => setIsLoadingMessages(false))
  }, [selectedConvo])

  // Real-time: subscribe to all messages for current user so story replies (and any new conversation) appear instantly
  useEffect(() => {
    if (!currentUser?.id) return
    const unsub = subscribeToUserMessages(
      currentUser.id,
      (msg: MessagePayload) => {
        const forSelectedConvo = msg.conversationId === selectedConvo
        if (messageIdsRef.current.has(msg.id)) {
          if (forSelectedConvo) {
            setMessages((prev) =>
              prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
            )
          }
          return
        }
        messageIdsRef.current.add(msg.id)
        if (forSelectedConvo) {
          setMessages((prev) => [...prev, { ...msg }])
          // Recipient is already viewing this conversation → mark as read so sender sees orange ticks instantly
          if (msg.senderId !== currentUser.id && selectedConvo) {
            messagesService.markAsRead(selectedConvo).then(() => refetchUnreadMessagesCount?.()).catch(() => {})
          }
        }
        // Refetch conversation list so new conversations appear and last message updates
        messagesService.getConversations(currentUser.id).then((data) => {
          if (!Array.isArray(data)) return
          const user = authService.getCurrentUser()
          if (!user?.id) return
          const mapped = data.map((c: any) => {
            const participantIds = c.participantIds || []
            const otherId = participantIds.find((id: string) => id !== user.id) || participantIds[0]
            const names = c.participantNames || {}
            const avatars = c.participantAvatars || {}
            const name = names[otherId] || "Unknown"
            const avatarUrl = avatars[otherId] ? resolvePostImageUrl(avatars[otherId]) : undefined
            const lastMessageAt = c.lastMessageAt
            const timestamp = parseBackendDate(lastMessageAt) || new Date()
            const unread = (c.unreadCounts && c.unreadCounts[user.id]) || 0
            const lastActiveAt = otherId ? c.participantLastActiveAt?.[otherId] : undefined
            return {
              id: c.id,
              name,
              avatar: avatarUrl,
              lastMessage: c.lastMessage || "",
              lastMessageAt,
              timestamp,
              timeLabel: formatMessageTime(lastMessageAt),
              unread,
              online: isOnline(lastActiveAt),
              lastActiveAt,
            }
          })
          const newIds = new Set(mapped.map((c: any) => c.id))
          const isNewConversation = newIds.has(msg.conversationId) && !conversationIdsRef.current.has(msg.conversationId)
          conversationIdsRef.current = newIds
          setConversationList(mapped)
          if (isNewConversation && !forSelectedConvo) {
            setSelectedConvo(msg.conversationId)
            setMessages([{ ...msg }])
          }
        }).catch(() => {})
      }
    )
    return unsub
  }, [currentUser?.id, selectedConvo])

  // Subscribe to selected conversation for read receipts (so our sent messages show blue ticks when seen)
  useEffect(() => {
    if (!selectedConvo) return
    return subscribeToConversation(
      selectedConvo,
      () => {},
      undefined,
      (messageIds) => {
        setMessages((prev) =>
          prev.map((m) => (messageIds.includes(m.id) ? { ...m, read: true } : m))
        )
      }
    )
  }, [selectedConvo])

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser?.id || !selectedConvo) return
    const content = message.trim()
    setMessage("")
    const sentOverWs = sendMessageOverWs(selectedConvo, {
      senderId: currentUser.id,
      senderName: currentUser.firstName || currentUser.username || "",
      content,
    })
    if (sentOverWs) return
    try {
      const sent = await messagesService.sendMessage({
        conversationId: selectedConvo,
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
    if (!editingMessageId || !editingContent.trim() || !currentUser?.id || !selectedConvo) return
    try {
      const updated = await messagesService.editMessage(selectedConvo, editingMessageId, editingContent.trim())
      if (updated?.id) handleMessageUpdate({ id: updated.id, content: updated.content, editedAt: updated.editedAt })
      setEditingMessageId(null)
      setEditingContent("")
    } catch {
      toast.error("Could not edit message. It may be too old to edit.")
    }
  }, [selectedConvo, editingMessageId, editingContent, currentUser?.id, handleMessageUpdate])

  const handleCancelEdit = useCallback(() => {
    setEditingMessageId(null)
    setEditingContent("")
  }, [])

  const handleOpenChatWith = useCallback(async (userId: string) => {
    if (!currentUser?.id || openingChatWithId) return
    setOpeningChatWithId(userId)
    try {
      const conv = await messagesService.createDirectConversation({ targetUserId: userId })
      setSelectedConvo(conv.id)
      await refetchConversations()
      refetchUnreadMessagesCount?.()
    } catch {
      toast.error("Could not start conversation")
    } finally {
      setOpeningChatWithId(null)
    }
  }, [currentUser?.id, openingChatWithId, refetchConversations, refetchUnreadMessagesCount])

  const activeConvo = conversationList.find((c) => c.id === selectedConvo)

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

  const displayName = (u: { firstName?: string; lastName?: string; username?: string }) =>
    [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "?"

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)]">
      {/* Conversation List - always visible when layout allows */}
      <div className="flex w-full shrink-0 flex-col border-r border-border md:w-80">
        {/* People you follow (mutual) - chat with */}
        {mutualFollows.length > 0 && (
          <div className="shrink-0 border-b border-border py-3">
            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Chat with
            </p>
            <div className="flex gap-4 overflow-x-auto px-4 pb-1 scroll-smooth [scrollbar-width:thin]">
              {mutualFollows.filter((u) => u.id !== currentUser?.id).map((user) => {
                const avatarUrl = user.profilePicture ? resolvePostImageUrl(user.profilePicture) : undefined
                const name = displayName(user)
                const isLoading = openingChatWithId === user.id
                const online = isOnline(user.lastActiveAt)
                const lastSeen = formatLastSeen(user.lastActiveAt)
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleOpenChatWith(user.id)}
                    disabled={isLoading}
                    className="flex shrink-0 flex-col items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-60"
                  >
                    <div className="relative h-14 w-14 shrink-0">
                      {avatarUrl && isAvatarImageUrl(avatarUrl) ? (
                        <div className="relative h-full w-full overflow-hidden rounded-full bg-muted ring-2 ring-border">
                          <Image
                            src={avatarUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary ring-2 ring-border">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${online ? "bg-green-500" : "bg-muted-foreground/60"}`}
                        aria-hidden
                      />
                    </div>
                    <span className="max-w-[72px] truncate text-center text-xs font-medium text-foreground">
                      {isLoading ? "Opening…" : name}
                    </span>
                    {lastSeen ? (
                      <span className="max-w-[72px] truncate text-center text-[10px] text-muted-foreground">
                        {lastSeen.replace(/^Last seen /, "")}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div className="border-b border-border bg-card px-4 py-4">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="h-10 w-full rounded-xl border border-border bg-muted/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-muted/80"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {conversationList.map((convo) => (
            <ConversationItem
              key={convo.id}
              userName={convo.name}
              userAvatar={convo.avatar}
              lastMessage={convo.lastMessage}
              timestamp={convo.timestamp}
              unread={convo.unread}
              isOnline={convo.online}
              verified={false}
              isSelected={convo.id === selectedConvo}
              onClick={() => {
                setSelectedConvo(convo.id)
                if (convo.unread > 0 && currentUser?.id) {
                  messagesService.markAsRead(convo.id).then(() => refetchUnreadMessagesCount?.()).catch(() => {})
                  setConversationList((prev) =>
                    prev.map((c) => (c.id === convo.id ? { ...c, unread: 0 } : c))
                  )
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Conversation View - only content changes when selecting a conversation */}
      <div className="flex flex-1 flex-col min-w-0">
        {activeConvo ? (
          isLoadingMessages ? (
            <ConversationLoadingSkeleton />
          ) : (
          <>
            {/* Chat Header - modern: avatar, name, subtitle, actions */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3.5 shrink-0">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {activeConvo.avatar ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border/50">
                    <Image src={activeConvo.avatar} alt={activeConvo.name} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="gradient-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-border/50">
                    {activeConvo.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">{activeConvo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeConvo.online ? "Online" : (formatLastSeen(activeConvo.lastActiveAt) || "Offline").replace(/^Last seen /, "")}
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

            {/* Messages Area - light grey background, generous spacing */}
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
                        senderAvatarUrl={!isOwn ? activeConvo?.avatar : undefined}
                        currentUserId={currentUser?.id}
                        preloadedPreview={item.referenceId ? storyPreviews[item.referenceId] : undefined}
                        conversationId={selectedConvo ?? undefined}
                        onReactionUpdate={handleReactionUpdate}
                      />
                    )
                  }
                  const isEditing = editingMessageId === item.id
                  const showEditButton = isOwn && selectedConvo && canEditMessage(item, currentUser?.id ?? "")

                  return (
                    <div key={item.id} className={isOwn ? "flex justify-end" : "flex justify-start"}>
                      {!isOwn && activeConvo?.avatar && (
                        <div className="relative mr-2 h-8 w-8 shrink-0 self-end overflow-hidden rounded-full bg-muted">
                          <Image
                            src={activeConvo.avatar}
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
                              {selectedConvo && (
                                <MessageReactions
                                  conversationId={selectedConvo}
                                  messageId={item.id}
                                  reactions={item.reactions}
                                  currentUserId={currentUser?.id}
                                  onReactionUpdate={handleReactionUpdate}
                                  align={isOwn ? "right" : "left"}
                                />
                              )}
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
                            <p className={cn("mt-1 flex items-center gap-2 text-xs tabular-nums", isOwn ? "justify-end text-muted-foreground" : "justify-start text-muted-foreground")}>
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

            {/* Message Input - clean bar */}
            <div className="border-t border-border bg-card px-4 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
          )
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">Click conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
