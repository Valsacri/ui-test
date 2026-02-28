"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Bell,
  CalendarDays,
  Heart,
  Trophy,
  Settings,
  UserPlus,
  MessageCircle,
  CheckCheck,
} from "lucide-react"
import { cn, formatFeedTime } from "@/lib/utils"
import { notificationsService, authService } from "@/lib/services"
import { NotificationSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { toast } from "sonner"
import { usePostModal } from "@/lib/post-modal-context"
import { useNotificationCountUpdate } from "@/lib/notification-count-context"

interface Notification {
  id: string
  type: "activity" | "social" | "booking" | "achievement" | "system" | "comment" | "follow"
  title: string
  message: string
  time: string
  read: boolean
  userName: string
  userAvatar: string
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
  comment: MessageCircle,
  follow: UserPlus,
}

const typeColors: Record<string, string> = {
  activity: "text-violet-500",
  social: "text-rose-500",
  booking: "text-blue-500",
  achievement: "text-amber-500",
  system: "text-slate-500",
  comment: "text-sky-500",
  follow: "text-emerald-500",
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")
  const user = authService.getCurrentUser()
  const { openPost } = usePostModal()
  const onUnreadNotificationsChange = useNotificationCountUpdate()

  const { data: rawNotifications, error, isLoading, mutate: mutateNotifications } = useSWR(
    user?.id ? `/notifications/user/${user.id}` : null,
    async (url: string) => {
      const data = await notificationsService.getByUser(user!.id)
      const list = Array.isArray(data) ? data : (data?.content || [])
      const mapType = (t: unknown): Notification["type"] => {
        const s = String(t ?? "").toUpperCase()
        if (s === "POST_LIKE") return "social"
        if (s === "POST_COMMENT" || s === "COMMENT_REPLY" || s === "COMMENT_LIKE") return "comment"
        return (t as Notification["type"]) || "system"
      }
      return list.map((n: Record<string, unknown>) => ({
        id: String(n.id),
        type: mapType(n.type),
        title: String(n.title || ""),
        message: String(n.message || ""),
        time: formatFeedTime(n.createdAt as string | number[] | undefined),
        read: Boolean(n.read),
        userName: String(n.senderName || n.referenceType || "Sporgates"),
        userAvatar: String(n.senderName || n.referenceType || "SG").substring(0, 2).toUpperCase(),
        postId: n.postId != null ? String(n.postId) : (String(n.referenceType || "").toLowerCase() === "post" && n.referenceId ? String(n.referenceId) : null),
        referenceId: n.referenceId != null ? String(n.referenceId) : null,
        referenceType: n.referenceType != null ? String(n.referenceType) : null,
      }))
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const notifications: Notification[] = rawNotifications || []

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
            return (
              <button
                key={notif.id}
                type="button"
                onClick={() => hasPost && handleNotificationClick(notif)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-4 rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-md",
                  !notif.read
                    ? "border-l-4 border-l-secondary border-t-border border-r-border border-b-border"
                    : "border-border",
                  !hasPost && "cursor-default"
                )}
              >
                {/* Avatar with icon overlay */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white",
                      !notif.read ? "gradient-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {!notif.read ? (
                      <span className="text-white">{notif.userAvatar}</span>
                    ) : (
                      <span>{notif.userAvatar}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-card">
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

                {/* Unread dot */}
                {!notif.read && (
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
