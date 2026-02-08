"use client"

import { Calendar, Clock, Download, MapPin, QrCode, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AttendanceQRCodeProps {
  activityId: string
  userId: string
  activityTitle: string
  activityDate?: string
  activityTime?: string
  location?: string
  ticketNumber?: string
  userName?: string
  onDownload?: () => void
  onShare?: () => void
}

const qrPattern = Array.from({ length: 9 }).map((_, row) =>
  Array.from({ length: 9 }).map((__, col) => (row + col) % 2 === 0)
)

export function AttendanceQRCode({
  activityId,
  userId,
  activityTitle,
  activityDate,
  activityTime,
  location,
  ticketNumber,
  userName,
  onDownload,
  onShare,
}: AttendanceQRCodeProps) {
  const displayTicket = ticketNumber || `TKT-${activityId}-${userId}`

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <QrCode className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Event Ticket</p>
          <p className="text-xs text-muted-foreground">Show at check-in</p>
        </div>
      </div>

      <div className="rounded-xl bg-primary px-4 py-3 text-white">
        <p className="text-base font-semibold">{activityTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/80">
          {activityDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {activityDate}
            </span>
          )}
          {activityTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activityTime}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-4">
        <div className="mx-auto grid w-40 grid-cols-9 gap-0.5 rounded-lg bg-card p-2">
          {qrPattern.flat().map((filled, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-sm",
                filled ? "bg-primary" : "bg-transparent"
              )}
            />
          ))}
        </div>
        <div className="mt-3 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">Ticket</p>
          <p className="text-xs font-semibold text-foreground">{displayTicket}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        Ticket holder: <span className="font-semibold text-foreground">{userName || "Participant"}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Download className="mr-2 inline h-3.5 w-3.5" />
          Download
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Share2 className="mr-2 inline h-3.5 w-3.5" />
          Share
        </button>
      </div>
    </div>
  )
}
