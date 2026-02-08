"use client"

import React from "react"

import { Bell, CalendarDays, Heart, Trophy, Settings } from "lucide-react"
import { notifications } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  activity: CalendarDays,
  social: Heart,
  booking: CalendarDays,
  achievement: Trophy,
  system: Settings,
}

export function NotificationsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your latest activity
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => {
          const Icon = typeIcons[notif.type] || Bell
          return (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50",
                !notif.read && "border-l-4 border-l-secondary"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  !notif.read ? "gradient-secondary text-white" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground">{notif.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
