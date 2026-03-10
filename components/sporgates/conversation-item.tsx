"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ConversationItemProps {
  userName: string
  userAvatar?: string
  lastMessage: string
  timestamp: Date
  unread: number
  isOnline: boolean
  verified?: boolean
  /** When true, shows selected state: left accent bar and subtle background */
  isSelected?: boolean
  /** When true, show two grey ticks under timestamp (e.g. last message from you) */
  showReadTicks?: boolean
  onClick: () => void
}

export function ConversationItem({
  userName,
  userAvatar,
  lastMessage,
  timestamp,
  unread,
  isOnline,
  verified,
  isSelected,
  showReadTicks,
  onClick,
}: ConversationItemProps) {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors",
        isSelected
          ? "border-l-4 border-l-primary bg-muted/60"
          : "border-l-4 border-l-transparent hover:bg-muted/40"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 rounded-full">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
          ) : null}
          <AvatarFallback className="rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{userName}</h3>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {timestamp && !isNaN(timestamp.getTime())
              ? formatDistanceToNow(timestamp, { addSuffix: true })
              : ""}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn(
              "flex-1 truncate text-[13px]",
              unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {lastMessage || "No messages yet"}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            {verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
            {unread > 0 && (
              <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                {unread}
              </Badge>
            )}
            {showReadTicks && (
              <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
