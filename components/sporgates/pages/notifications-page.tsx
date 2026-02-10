"use client"

import { useState } from "react"
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

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "activity",
    title: "Activity Reminder",
    message: "5v5 Basketball Pickup Game starts in 2 hours",
    time: "2 hours ago",
    read: false,
    userName: "Chelsea Piers",
    userAvatar: "CP",
  },
  {
    id: "2",
    type: "social",
    title: "New Like",
    message: "liked your post about the basketball session",
    time: "3 hours ago",
    read: false,
    userName: "Sarah Lee",
    userAvatar: "SL",
  },
  {
    id: "3",
    type: "follow",
    title: "New Follower",
    message: "started following you",
    time: "4 hours ago",
    read: false,
    userName: "Mike Johnson",
    userAvatar: "MJ",
  },
  {
    id: "4",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your court booking at Chelsea Piers is confirmed for Feb 10",
    time: "1 day ago",
    read: true,
    userName: "Chelsea Piers",
    userAvatar: "CP",
  },
  {
    id: "5",
    type: "comment",
    title: "New Comment",
    message: "commented on your workout: \"Great progress! 💪\"",
    time: "1 day ago",
    read: true,
    userName: "Alex Chen",
    userAvatar: "AC",
  },
  {
    id: "6",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You earned the 'Early Bird' badge for 10 morning activities!",
    time: "2 days ago",
    read: true,
    userName: "Sporgates",
    userAvatar: "SG",
  },
  {
    id: "7",
    type: "activity",
    title: "Activity Invitation",
    message: "invited you to join \"Tennis Doubles Match\"",
    time: "2 days ago",
    read: true,
    userName: "Emily Park",
    userAvatar: "EP",
  },
  {
    id: "8",
    type: "social",
    title: "New Like",
    message: "liked your photo",
    time: "3 days ago",
    read: true,
    userName: "Carlos Rivera",
    userAvatar: "CR",
  },
  {
    id: "9",
    type: "system",
    title: "System Update",
    message: "New features available! Check out the updated marketplace.",
    time: "3 days ago",
    read: true,
    userName: "Sporgates",
    userAvatar: "SG",
  },
]

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
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayedNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.read) : notifications

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
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
            <p className="text-sm font-semibold text-foreground">No unread notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">You're all caught up!</p>
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
