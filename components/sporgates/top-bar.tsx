"use client"

import {
  Search,
  Bell,
  MessageCircle,
  MessageSquare,
  Wallet,
  ChevronDown,
  Target,
  User,
  Building2,
  LogOut,
  Settings,
  CalendarDays,
  Heart,
  Trophy,
  X,
  ShoppingCart,
} from "lucide-react"
import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth"
import { userService } from "@/lib/services/user"
import { searchService } from "@/lib/services/search"
import { messagesService } from "@/lib/services/messages"
import { notificationsService } from "@/lib/services/notifications"
import { cn, resolvePostImageUrl, isAvatarImageUrl, formatFeedTime, formatMessageTime, isOnline } from "@/lib/utils"
import type { PageRoute } from "@/lib/navigation"
import { SporgatesLogoText } from "@/components/sporgates/sporgates-logo-text"
import { ConfirmDialog } from "@/components/sporgates/ux/confirm-dialog"
import { usePostModal } from "@/lib/post-modal-context"
import { useStoryModal } from "@/lib/story-modal-context"
import { useStoryReplyModal } from "@/lib/story-reply-modal-context"
import { useCart } from "@/lib/cart-context"
import { useCartDrawer } from "@/lib/cart-drawer-context"

// Inline defaults — no BE endpoints for topbar goals/conversations/notifications preview
const goals = [
  { id: "g1", title: "Weekly Activity", progress: 3, target: 5, unit: "sessions" },
  { id: "g2", title: "Monthly Distance", progress: 18, target: 30, unit: "km" },
]
// Conversations and notifications are loaded from API when dropdowns open (see useEffect below).

type Business = {
  id: string;
  name: string;
  type: string;
  emoji?: string;
  avatar?: string;
  location: string;
  rating: number;
  followers: number
}

const notifTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  activity: CalendarDays,
  social: Heart,
  post_like: Heart,
  comment_like: Heart,
  comment: MessageSquare,
  post_comment: MessageSquare,
  comment_reply: MessageSquare,
  booking: CalendarDays,
  achievement: Trophy,
  system: Settings,
  message_reaction: Heart,
}

interface TopBarProps {
  onNavigate: (page: PageRoute, id?: string) => void
  isBusinessMode: boolean
  businesses: Business[]
  activeBusinessId: string | null
  onSwitchBusiness: (id: string) => void
  onSwitchToUser: () => void
  onCreateNewBusiness: () => void
  unreadMessages: number
  unreadNotifications: number
  onUnreadNotificationsChange?: (updater: number | ((prev: number) => number)) => void
}

export function TopBar({
  onNavigate,
  isBusinessMode,
  businesses,
  activeBusinessId,
  onSwitchBusiness,
  onSwitchToUser,
  onCreateNewBusiness,
  unreadMessages,
  unreadNotifications,
  onUnreadNotificationsChange,
}: TopBarProps) {
  const cart = useCart()
  const cartCount = cart?.cartCount ?? 0
  const { openCart, closeCart } = useCartDrawer()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const [showGoal, setShowGoal] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const currentGoal = goals[0]
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<unknown>(null)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [conversations, setConversations] = useState<Array<{ id: string; name: string; avatar: string; avatarUrl: string | null; lastMessage: string; time: string; unread: number; online?: boolean }>>([])
  const [conversationsLoading, setConversationsLoading] = useState(false)
  const [notificationsList, setNotificationsList] = useState<Array<{
    id: string
    type: string
    title: string
    message: string
    time: string
    read: boolean
    postId: string | null
    referenceId: string | null
    referenceType: string | null
    senderId: string | null
    senderName: string | null
    senderAvatar: string | null
  }>>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const { openPost } = usePostModal()
  const { openStory } = useStoryModal()
  const { openStoryReply } = useStoryReplyModal()

  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<{ id?: string; firstName?: string; lastName?: string; email?: string } | null>(null)
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setUserProfilePicture(null)
      return
    }
    userService.getUserById(user.id).then((data: { profilePicture?: string | null }) => {
      setUserProfilePicture(data?.profilePicture ?? null)
    }).catch(() => setUserProfilePicture(null))
  }, [user?.id])

  useEffect(() => {
    if (!showMessages || !user?.id) return
    setConversationsLoading(true)
    messagesService.getConversations(user.id)
      .then((data: any[]) => {
        const list = Array.isArray(data) ? data : []
        setConversations(list.slice(0, 10).map((c: any) => {
          const ids = c.participantIds || []
          const otherId = ids.find((id: string) => id !== user.id) || ids[0]
          const names = c.participantNames || {}
          const avatars = c.participantAvatars || {}
          const name = c.name || (otherId && names[otherId]) || "Conversation"
          const avatarUrlRaw = otherId && avatars[otherId] ? String(avatars[otherId]).trim() : ""
          const avatarUrl = avatarUrlRaw ? resolvePostImageUrl(avatarUrlRaw) : null
          const initials = (name || "C").slice(0, 2).toUpperCase()
          const time = formatMessageTime(c.lastMessageAt)
          const lastActiveAt = otherId ? c.participantLastActiveAt?.[otherId] : undefined
          // In dropdown show only received messages; hide preview when last message was sent by current user
          const lastFromOther = c.lastMessageSenderId !== user?.id
          const lastMessage = lastFromOther ? (c.lastMessageContent || c.lastMessage || "") : ""
          return {
            id: c.id || String(c),
            name,
            avatar: initials,
            avatarUrl,
            lastMessage,
            time,
            unread: (user?.id && c.unreadCounts?.[user.id]) ?? c.unreadCount ?? 0,
            online: isOnline(lastActiveAt),
          }
        }))
      })
      .catch(() => setConversations([]))
      .finally(() => setConversationsLoading(false))
  }, [showMessages, user?.id])

  useEffect(() => {
    if (!showNotifications || !user?.id) return
    setNotificationsLoading(true)
    notificationsService.getByUser(user.id)
      .then((data: any) => {
        const list = Array.isArray(data) ? data : (data?.content ?? [])
        setNotificationsList(list.slice(0, 15).map((n: any) => {
          const postId = n.postId != null ? String(n.postId) : (n.referenceType?.toLowerCase() === "post" && n.referenceId ? String(n.referenceId) : null)
          const senderName = n.senderName ?? n.sender_name
          const senderAvatar = n.senderAvatar ?? n.sender_avatar
          const rawType = String(n.type || "").toUpperCase()
          const titleStr = String(n.title || "").toLowerCase()
          const type = rawType === "SOCIAL" ? (titleStr.includes("comment") ? "comment" : "social") : (n.type || "system")
          return {
            id: String(n.id),
            type,
            title: String(n.title || ""),
            message: String(n.message || ""),
            time: formatFeedTime(n.createdAt),
            read: Boolean(n.read),
            postId,
            referenceId: n.referenceId != null ? String(n.referenceId) : null,
            referenceType: n.referenceType != null ? String(n.referenceType) : null,
            senderId: n.senderId != null ? String(n.senderId) : null,
            senderName: senderName != null && String(senderName).trim() !== "" ? String(senderName) : null,
            senderAvatar: senderAvatar != null && String(senderAvatar).trim() !== "" ? String(senderAvatar) : null,
          }
        }))
      })
      .catch(() => setNotificationsList([]))
      .finally(() => setNotificationsLoading(false))
  }, [showNotifications, user?.id])

  const handleLogout = async () => {
    await authService.logout()
    // Force full page reload to clear state and trigger AuthGuard
    window.location.href = "/signin"
  }

  const closeAll = () => {
    setShowProfileMenu(false)
    setShowWallet(false)
    setShowGoal(false)
    setShowMessages(false)
    setShowNotifications(false)
    setShowSearchDropdown(false)
    closeCart()
  }

  // Debounced search suggestions when user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions(null)
      setShowSearchDropdown(false)
      return
    }
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      searchService.getSuggestions(searchQuery, 8)
        .then((data) => {
          setSearchSuggestions(data)
          setShowSearchDropdown(true)
        })
        .catch(() => setSearchSuggestions(null))
    }, 300)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery])

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    closeAll()
    setIsSearching(true)
    searchService.search({ query: q })
      .then(() => {
        router.push(`/explore?q=${encodeURIComponent(q)}`)
      })
      .catch(() => { })
      .finally(() => setIsSearching(false))
  }, [searchQuery, router])

  // Close dropdowns when clicking outside the top-bar action cluster.
  // Clicks inside the cart drawer panel must NOT run closeAll — the drawer lives outside
  // `dropdownRef`, so +/- / remove were incorrectly closing the cart.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target
      const el = target instanceof Element ? target : null
      if (el?.closest('[data-cart-drawer="panel"]')) {
        return
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target as Node)) {
        closeAll()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 shadow-sm lg:px-6">
      {/* Logo */}
      <button
        type="button"
        onClick={() => onNavigate(isBusinessMode ? "business-dashboard" : "home")}
        className="flex min-w-0 shrink items-center"
        aria-label="Sporgates home"
      >
        <SporgatesLogoText
          heightClass="h-6 sm:h-7 md:h-8"
          priority
          className="max-w-[min(220px,52vw)] sm:max-w-none"
        />
      </button>

      {/* Search — wired to searchService (SearchController) */}
      <div ref={searchContainerRef} className="relative hidden max-w-md flex-1 md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
            placeholder="Search activities, facilities, people..."
            aria-label="Search activities, facilities, people"
            disabled={isSearching}
            className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </form>
        {showSearchDropdown && searchSuggestions ? (
          <div
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-card py-2 shadow-lg"
            role="listbox"
          >
            <p className="px-4 py-1 text-xs text-muted-foreground">Suggestions — press Enter to search</p>
            {(() => {
              const res = searchSuggestions as { suggestions?: string[]; results?: Record<string, Array<{ id?: string; title?: string }>> }
              const suggestionsList = Array.isArray(res.suggestions)
                ? res.suggestions.slice(0, 8).map((s) => ({ text: s, id: s }))
                : res.results && typeof res.results === "object"
                  ? Object.values(res.results).flat().slice(0, 8).map((r) => ({ text: r.title ?? r.id ?? "—", id: r.id ?? r.title ?? "" }))
                  : []
              return suggestionsList.map((item, i) => (
                <button
                  key={item.id || i}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setSearchQuery(item.text)
                    setShowSearchDropdown(false)
                    searchService.search({ query: item.text }).then(() => router.push(`/explore?q=${encodeURIComponent(item.text)}`)).catch(() => { })
                  }}
                >
                  {item.text}
                </button>
              ))
            })()}
          </div>
        ) : null}
      </div>

      {/* Right actions */}
      <div ref={dropdownRef} className="flex items-center gap-2">
        {/* Goal Widget */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => {
              const next = !showGoal
              closeAll()
              setShowGoal(next)
            }}
            className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
          >
            <Target className="h-3.5 w-3.5 text-secondary" />
            <span className="max-w-[100px] truncate">{currentGoal.title}</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
              <div
                className="gradient-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentGoal.progress / currentGoal.target) * 100}%` }}
              />
            </div>
          </button>
          {showGoal && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
              <h4 className="mb-3 text-sm font-semibold text-foreground">Current Goals</h4>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-muted-foreground">
                        {goal.progress}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              const next = !showWallet
              closeAll()
              setShowWallet(next)
            }}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
          >
            <Wallet className="h-3.5 w-3.5 text-primary" />
            <span>$0.00</span>
          </button>
          {showWallet && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-4 shadow-lg">
              <h4 className="mb-2 text-sm font-semibold text-foreground">Wallet</h4>
              <p className="mb-3 text-2xl font-bold text-primary">$0.00</p>
              <button
                type="button"
                className="gradient-primary w-full rounded-lg py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                Add Funds
              </button>
            </div>
          )}
        </div>

        {/* Cart (user mode): right-side drawer — marketplace link lives in sidebar */}
        {!isBusinessMode && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                closeAll()
                openCart()
              }}
              className="relative rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-secondary px-0.5 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Messages Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const next = !showMessages
              closeAll()
              setShowMessages(next)
            }}
            className={cn(
              "relative rounded-full p-2 transition-colors hover:bg-muted",
              showMessages && "bg-muted"
            )}
          >
            <MessageCircle className="h-5 w-5 text-foreground" />
            {unreadMessages > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {unreadMessages}
              </span>
            )}
          </button>
          {showMessages && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl sm:w-96">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-base font-bold text-foreground">Messages</h3>
                <button
                  type="button"
                  onClick={() => setShowMessages(false)}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">Loading…</div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageCircle className="mb-2 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((convo) => (
                    <button
                      type="button"
                      key={convo.id}
                      onClick={() => {
                        closeAll()
                        onNavigate("conversation", convo.id)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                        {convo.avatarUrl && isAvatarImageUrl(convo.avatarUrl) ? (
                          <Image
                            src={convo.avatarUrl}
                            alt={convo.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                            {convo.avatar}
                          </div>
                        )}
                        {convo.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("truncate text-sm", convo.unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground")}>{convo.name}</p>
                          <span className={cn("shrink-0 text-[11px]", convo.unread > 0 ? "font-semibold text-secondary" : "text-muted-foreground")}>{convo.time}</span>
                        </div>
                        <p className={cn("truncate text-xs", convo.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>{convo.lastMessage}</p>
                      </div>
                      {convo.unread > 0 && (
                        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    closeAll()
                    onNavigate("messages")
                  }}
                  className="flex w-full items-center justify-center py-3 text-sm font-semibold text-secondary transition-colors hover:bg-muted"
                >
                  See All in Messenger
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const next = !showNotifications
              closeAll()
              setShowNotifications(next)
            }}
            className={cn(
              "relative rounded-full p-2 transition-colors hover:bg-muted",
              showNotifications && "bg-muted"
            )}
          >
            <Bell className="h-5 w-5 text-foreground" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl sm:w-96">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-base font-bold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                  {notificationsList.some((n) => !n.read) && user?.id && (
                    <button
                      type="button"
                      onClick={() => {
                        notificationsService.markAllAsRead(user.id!).then(() => {
                          setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })))
                          onUnreadNotificationsChange?.(0)
                        }).catch(() => { })
                      }}
                      className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-full p-1 transition-colors hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">Loading…</div>
                ) : notificationsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="mb-2 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notificationsList.map((notif) => {
                    const Icon = notifTypeIcons[notif.type.toLowerCase()] || Bell
                    const postIdToOpen = notif.postId ?? (notif.referenceType?.toLowerCase() === "post" && notif.referenceId ? notif.referenceId : null)
                    const isCommentNotification = ["POST_COMMENT", "COMMENT_REPLY", "COMMENT_LIKE"].includes(String(notif.type).toUpperCase())
                    const isStoryReply = notif.referenceType?.toUpperCase() === "STORY_REPLY" && notif.referenceId && notif.senderId
                    const isStoryNotification = notif.referenceType?.toUpperCase() === "STORY" && notif.referenceId && user?.id
                    return (
                      <button
                        type="button"
                        key={notif.id}
                        onClick={() => {
                          closeAll()
                          if (!notif.read) {
                            setNotificationsList((prev) =>
                              prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                            )
                            onUnreadNotificationsChange?.((prev: number) => Math.max(0, prev - 1))
                            notificationsService.markAsRead(notif.id).catch(() => { })
                          }
                          if (postIdToOpen) {
                            openPost(postIdToOpen, isCommentNotification)
                          } else if (isStoryReply && notif.referenceId && notif.senderId) {
                            openStoryReply({
                              id: notif.id,
                              storyId: notif.referenceId,
                              message: notif.message,
                              senderId: notif.senderId,
                              senderName: notif.senderName ?? "Someone",
                              senderAvatar: notif.senderAvatar,
                            })
                          } else if (isStoryNotification && user?.id && notif.referenceId) {
                            openStory(user.id, notif.referenceId)
                          } else if (notif.referenceType?.toUpperCase() === "CONVERSATION" && notif.referenceId) {
                            onNavigate("conversation", notif.referenceId)
                          } else {
                            onNavigate("notifications")
                          }
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted",
                          !notif.read && "bg-secondary/5"
                        )}
                      >
                        <div className="relative shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden relative bg-muted">
                            {notif.senderAvatar ? (
                              <Image
                                src={resolvePostImageUrl(notif.senderAvatar)}
                                alt={notif.senderName || "User"}
                                fill
                                className="object-cover z-10"
                                sizes="40px"
                                onError={(e) => { e.currentTarget.style.display = "none" }}
                              />
                            ) : null}
                            <span
                              className={cn(
                                "absolute inset-0 flex items-center justify-center text-xs font-bold",
                                notif.senderAvatar ? "z-0 bg-muted text-muted-foreground" : "z-10",
                                !notif.senderAvatar && !notif.read && "gradient-secondary text-white",
                                !notif.senderAvatar && notif.read && "text-muted-foreground"
                              )}
                              aria-hidden={!!notif.senderAvatar}
                            >
                              {notif.senderName ? notif.senderName.substring(0, 2).toUpperCase() : ""}
                            </span>
                            {!notif.senderAvatar && !notif.senderName ? (
                              <span className="absolute inset-0 flex items-center justify-center z-10">
                                <Icon className={cn("h-5 w-5", !notif.read ? "text-white" : "text-muted-foreground")} />
                              </span>
                            ) : null}
                          </div>
                          {(notif.senderAvatar || notif.senderName) && (
                            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-card bg-card z-20">
                              <Icon className="h-2 w-2 text-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-sm", !notif.read ? "font-bold text-foreground" : "font-medium text-foreground")}>{notif.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{notif.message}</p>
                          <p className={cn("mt-0.5 text-[11px]", !notif.read ? "font-semibold text-secondary" : "text-muted-foreground")}>{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    closeAll()
                    onNavigate("notifications")
                  }}
                  className="flex w-full items-center justify-center py-3 text-sm font-semibold text-secondary transition-colors hover:bg-muted"
                >
                  See All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const next = !showProfileMenu
              closeAll()
              setShowProfileMenu(next)
            }}
            className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-muted"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
              {isAvatarImageUrl(userProfilePicture ?? undefined) ? (
                <Image src={resolvePostImageUrl(userProfilePicture ?? undefined)!} alt={user ? `${user.firstName} ${user.lastName}` : "User"} fill className="object-cover" sizes="32px" />
              ) : (
                <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {(user?.firstName?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card py-2 shadow-lg">
              {/* User profile */}
              <button
                type="button"
                onClick={() => {
                  if (isBusinessMode) {
                    onSwitchToUser()
                  } else {
                    onNavigate("profile")
                  }
                  setShowProfileMenu(false)
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted",
                  !isBusinessMode && "bg-primary/5"
                )}
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                  {isAvatarImageUrl(userProfilePicture ?? undefined) ? (
                    <Image src={resolvePostImageUrl(userProfilePicture ?? undefined)!} alt={user ? `${user.firstName} ${user.lastName}` : "User"} fill className="object-cover" sizes="36px" />
                  ) : (
                    <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                      {(user?.firstName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">{user ? `${user.firstName} ${user.lastName}` : "User"}</p>
                  <p className="text-[11px] text-muted-foreground">Personal Account</p>
                </div>
                {!isBusinessMode && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>

              {/* Businesses */}
              {businesses.length > 0 && (
                <div className="border-t border-border pt-1 mt-1">
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Businesses
                  </p>
                  {businesses.map((biz) => (
                    <button
                      type="button"
                      key={biz.id}
                      onClick={() => {
                        onSwitchBusiness(biz.id)
                        setShowProfileMenu(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted",
                        activeBusinessId === biz.id && "bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-base overflow-hidden",
                        biz.avatar && "bg-transparent"
                      )}>
                        {biz.avatar ? (
                          <Image src={biz.avatar} alt={biz.name} fill className="object-cover" sizes="36px" />
                        ) : (
                          biz.emoji || <Building2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-semibold text-foreground">{biz.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground" title={biz.type}>{biz.type}</p>
                      </div>
                      {activeBusinessId === biz.id && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Create New Business */}
              <div className="border-t border-border pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    onCreateNewBusiness()
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border">
                    <span className="text-lg text-muted-foreground">+</span>
                  </div>
                  <span className="font-medium text-primary">Create New Business</span>
                </button>
              </div>

              {/* Settings & Sign Out */}
              <div className="border-t border-border pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("settings")
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    setShowLogoutConfirm(true)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive transition-colors hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Sign Out?"
        description="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmLabel="Sign Out"
        variant="danger"
        onConfirm={handleLogout}
      />
    </header>
  )
}
