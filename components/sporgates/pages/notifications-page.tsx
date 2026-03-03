"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import {
  Bell,
  CalendarDays,
  Heart,
  Trophy,
  Settings,
  UserPlus,
  UserCheck,
  MessageSquare,
  CheckCheck,
} from "lucide-react"
import { cn, formatFeedTime, resolvePostImageUrl } from "@/lib/utils"
import Image from "next/image"
import { notificationsService, authService, userService } from "@/lib/services"
import { NotificationSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { toast } from "sonner"
import { usePostModal } from "@/lib/post-modal-context"
import { useStoryModal } from "@/lib/story-modal-context"
import { useNotificationCountUpdate } from "@/lib/notification-count-context"
import { useNotificationStream } from "@/lib/hooks/use-notification-stream"

interface Notification {
  id: string
  type: "activity" | "social" | "booking" | "achievement" | "system" | "comment" | "follow" | "follow_back"
  title: string
  message: string
  time: string
  read: boolean
  userName: string
  userAvatar: string
  senderAvatar: string | null
  /** Post to open when notification is clicked (backend postId or referenceId for type "post"). */
  postId: string | null
  referenceId: string | null
  referenceType: string | null
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  activity: CalendarDays,
  social: Heart,
  booking: CalendarDays,
  achievement: Trophy,
  system: Settings,
  comment: MessageSquare,
  follow: UserPlus,
  follow_back: UserCheck,
}

const typeColors: Record<string, string> = {
  activity: "text-violet-500",
  social: "text-rose-500",
  booking: "text-blue-500",
  achievement: "text-amber-500",
  system: "text-slate-500",
  comment: "text-sky-500",
  follow: "text-emerald-500",
  follow_back: "text-emerald-500",
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")
  const user = authService.getCurrentUser()
  const { openPost } = usePostModal()
  const { openStory } = useStoryModal()
  const onUnreadNotificationsChange = useNotificationCountUpdate()

  const { data: rawNotifications, error, isLoading, mutate: mutateNotifications } = useSWR(
    user?.id ? `/notifications/user/${user.id}` : null,
    async (url: string) => {
      const data = await notificationsService.getByUser(user!.id)
      const list = Array.isArray(data) ? data : (data?.content || [])
      const mapType = (t: unknown, title?: unknown): Notification["type"] => {
        const s = String(t ?? "").toUpperCase()
        const titleStr = String(title ?? "").toLowerCase()
        if (s === "POST_COMMENT" || s === "COMMENT_REPLY") return "comment"
        if (s === "SOCIAL") return titleStr.includes("comment") ? "comment" : "social"
        if (s === "POST_LIKE" || s === "COMMENT_LIKE") return "social"
        if (s === "NEW_FOLLOWER") return "follow"
        if (s === "FOLLOW_BACK") return "follow_back"
        return (t as Notification["type"]) || "system"
      }
      return list.map((n: Record<string, unknown>) => ({
        id: String(n.id),
        type: mapType(n.type, n.title),
        title: String(n.title || ""),
        message: String(n.message || ""),
        time: formatFeedTime(n.createdAt as string | number[] | undefined),
        read: Boolean(n.read),
        userName: String(n.senderName ?? n.sender_name ?? n.referenceType ?? "Sporgates"),
        userAvatar: String(n.senderName ?? n.sender_name ?? n.referenceType ?? "SG").substring(0, 2).toUpperCase(),
        senderAvatar: [n.senderAvatar, (n as Record<string, unknown>).sender_avatar].find((v): v is string => typeof v === "string" && v.length > 0) ?? null,
        postId: n.postId != null ? String(n.postId) : (String(n.referenceType || "").toLowerCase() === "post" && n.referenceId ? String(n.referenceId) : null),
        referenceId: n.referenceId != null ? String(n.referenceId) : null,
        referenceType: n.referenceType != null ? String(n.referenceType) : null,
      }))
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const notifications: Notification[] = rawNotifications || []

  // Live-refresh the list when a new SSE notification arrives
  const handleSseNotification = useCallback(() => { mutateNotifications() }, [mutateNotifications])
  useNotificationStream(user?.id ?? null, handleSseNotification)

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayedNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.read) : notifications

  const handleMarkAllRead = async () => {
    // Optimistic update
    mutateNotifications(
      notifications.map((n: Notification) => ({ ...n, read: true })),
      false
    )
    onUnreadNotificationsChange?.(0)
    if (user?.id) {
      try {
        await notificationsService.markAllAsRead(user.id)
        toast.success("All notifications marked as read")
      } catch {
        toast.error("Failed to mark notifications as read")
        mutateNotifications() // revert on failure
      }
    }
  }

  const handleNotificationClick = (notif: Notification) => {
    const postIdToOpen = notif.postId ?? (notif.referenceType?.toLowerCase() === "post" && notif.referenceId ? notif.referenceId : null)
    if (postIdToOpen) {
      const openComments = notif.type === "comment"
      openPost(postIdToOpen, openComments)
      if (!notif.read) {
        mutateNotifications(
          notifications.map((n: Notification) => (n.id === notif.id ? { ...n, read: true } : n)),
          false
        )
        onUnreadNotificationsChange?.((prev) => Math.max(0, prev - 1))
        notificationsService.markAsRead(notif.id).catch(() => mutateNotifications())
      }
      return
    }
    // "Liked your story" — open story viewer (recipient is the story author)
    const isStoryNotification = notif.referenceType?.toUpperCase() === "STORY" && notif.referenceId && user?.id
    if (isStoryNotification) {
      openStory(user.id, notif.referenceId)
      if (!notif.read) {
        mutateNotifications(
          notifications.map((n: Notification) => (n.id === notif.id ? { ...n, read: true } : n)),
          false
        )
        onUnreadNotificationsChange?.((prev) => Math.max(0, prev - 1))
        notificationsService.markAsRead(notif.id).catch(() => mutateNotifications())
      }
    }
  }

  const [followedBackIds, setFollowedBackIds] = useState<Set<string>>(new Set())

  const handleFollowBack = async (notif: Notification) => {
    if (!user?.id || !notif.referenceId) return
    try {
      await userService.followUser(user.id, notif.referenceId)
      setFollowedBackIds((prev) => new Set(prev).add(notif.referenceId!))
      toast.success("Followed back!")
    } catch {
      toast.error("Failed to follow back")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated with your latest activity</p>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message="Failed to load notifications" onRetry={() => mutateNotifications()} />
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your latest activity
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary hover:text-white"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow-md"
                : "border border-border bg-card text-foreground hover:bg-muted"
            )}
          >
            {tab === "all" ? "All" : "Unread"}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {displayedNotifications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Bell className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">
              {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeTab === "unread" ? "You're all caught up!" : "When you get notifications, they'll show up here"}
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell
            const iconColor = typeColors[notif.type] || "text-muted-foreground"
            const hasPost = notif.postId ?? (notif.referenceType?.toLowerCase() === "post" && notif.referenceId)
            const hasStory = notif.referenceType?.toUpperCase() === "STORY" && notif.referenceId && user?.id
            const isClickable = hasPost || hasStory
            return (
              <div
                key={notif.id}
                role="button"
                tabIndex={0}
                onClick={() => isClickable && handleNotificationClick(notif)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-md",
                  !notif.read
                    ? "border-l-4 border-l-secondary border-t-border border-r-border border-b-border"
                    : "border-border",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                {/* Avatar: concerned user's profile image (e.g. "Red kaz started following you") */}
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold overflow-hidden relative bg-muted">
                    {notif.senderAvatar ? (
                      <Image
                        src={resolvePostImageUrl(notif.senderAvatar)}
                        alt={notif.userName}
                        fill
                        className="object-cover z-10"
                        sizes="44px"
                        onError={(e) => { e.currentTarget.style.display = "none" }}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        !notif.senderAvatar && !notif.read && "gradient-primary text-white z-10",
                        !notif.senderAvatar && notif.read && "text-muted-foreground z-10",
                        notif.senderAvatar && "z-0 bg-muted text-muted-foreground"
                      )}
                      aria-hidden={!!notif.senderAvatar}
                    >
                      {notif.userAvatar}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-card z-20">
                    <Icon className={cn("h-3 w-3", iconColor)} />
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{notif.userName}</span>{" "}
                    <span className="text-muted-foreground">{notif.message}</span>
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{notif.time}</p>
                </div>

                {/* Follow Back button for follow notifications */}
                {notif.type === "follow" && notif.referenceType?.toUpperCase() === "USER" && notif.referenceId && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleFollowBack(notif) }}
                    disabled={followedBackIds.has(notif.referenceId)}
                    className={cn(
                      "shrink-0 self-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                      followedBackIds.has(notif.referenceId)
                        ? "bg-muted text-muted-foreground cursor-default"
                        : "gradient-primary text-white hover:shadow-md"
                    )}
                  >
                    {followedBackIds.has(notif.referenceId) ? "Following" : "Follow Back"}
                  </button>
                )}

                {/* Get in touch button for follow back notifications */}
                {notif.type === "follow_back" && notif.referenceType?.toUpperCase() === "USER" && notif.referenceId && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toast.info("Messaging feature coming soon!") }}
                    className="shrink-0 self-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted"
                  >
                    Get in touch
                  </button>
                )}

                {/* Unread dot */}
                {!notif.read && notif.type !== "follow" && notif.type !== "follow_back" && (
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
