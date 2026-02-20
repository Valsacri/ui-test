"use client"

import { useState, useEffect } from "react"
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
import { cn } from "@/lib/utils"
import { notificationsService, authService } from "@/lib/services"
import { NotificationSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "activity" | "social" | "booking" | "achievement" | "system" | "comment" | "follow"
  title: string
  message: string
  time: string
  read: boolean
  userName: string
  userAvatar: string
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

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    if (diffMin < 1) return "Just now"
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  } catch {
    return dateStr || ""
  }
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  const fetchNotifications = async () => {
    const user = authService.getCurrentUser()
    if (!user?.id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const data = await notificationsService.getByUser(user.id)
      const list = Array.isArray(data) ? data : (data?.content || [])
      setNotifications(list.map((n: Record<string, unknown>) => ({
        id: String(n.id),
        type: (n.type as Notification["type"]) || "system",
        title: String(n.title || ""),
        message: String(n.message || ""),
        time: n.createdAt ? formatTimeAgo(String(n.createdAt)) : "",
        read: Boolean(n.read),
        userName: String(n.senderName || n.referenceType || "Sporgates"),
        userAvatar: String(n.senderName || n.referenceType || "SG").substring(0, 2).toUpperCase(),
      })))
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setError("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayedNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.read) : notifications

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    const user = authService.getCurrentUser()
    if (user?.id) {
      try {
        await notificationsService.markAllAsRead(user.id)
        toast.success("All notifications marked as read")
      } catch {
        toast.error("Failed to mark notifications as read")
      }
    }
  }

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
    notificationsService.markAsRead(id).catch(() => { })
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
    return <ErrorState message={error} onRetry={fetchNotifications} />
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
            return (
              <button
                type="button"
                key={notif.id}
                onClick={() => handleToggleRead(notif.id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-md",
                  !notif.read
                    ? "border-l-4 border-l-secondary border-t-border border-r-border border-b-border"
                    : "border-border"
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
