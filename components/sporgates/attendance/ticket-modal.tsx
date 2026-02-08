"use client"

import { X } from "lucide-react"
import { AttendanceQRCode } from "@/components/sporgates/attendance/attendance-qr-code"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
  activityId: string
  userId: string
  activityTitle: string
  activityDate?: string
  activityTime?: string
  location?: string
  userName?: string
}

export function TicketModal({
  isOpen,
  onClose,
  activityId,
  userId,
  activityTitle,
  activityDate,
  activityTime,
  location,
  userName,
}: TicketModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Your Event Ticket</p>
            <p className="text-xs text-muted-foreground">Bring this code to check in</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">
          <AttendanceQRCode
            activityId={activityId}
            userId={userId}
            activityTitle={activityTitle}
            activityDate={activityDate}
            activityTime={activityTime}
            location={location}
            userName={userName}
          />
          <button
            type="button"
            onClick={onClose}
            className="gradient-primary mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
