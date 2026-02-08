"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ConversationItemProps {
  userName: string
  userAvatar?: string
  lastMessage: string
  timestamp: Date
  unread: number
  isOnline: boolean
  verified?: boolean
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
      className="flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{userName}</h3>
          {verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
        </div>
        <p className={unread > 0 ? "truncate text-sm font-semibold text-foreground" : "truncate text-sm text-muted-foreground"}>
          {lastMessage}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        {unread > 0 && (
          <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
            {unread}
          </Badge>
        )}
      </div>
    </button>
  )
}
