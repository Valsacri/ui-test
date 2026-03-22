"use client"

import { useRef, useCallback } from "react"
import { AttendanceQRCode } from "@/components/sporgates/attendance/attendance-qr-code"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

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
  ticketCode?: string
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
  ticketCode,
}: TicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const handleDownload = useCallback(async () => {
    if (!ticketRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const pdf = new jsPDF("p", "mm", "a4")
      const xOffset = (pdf.internal.pageSize.getWidth() - imgWidth) / 2
      const yOffset = 20

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight)
      pdf.save(`ticket-${activityTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`)

      toast.success("Ticket downloaded!")
    } catch {
      toast.error("Failed to download ticket")
    }
  }, [activityTitle])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0">
        <DialogTitle className="sr-only">Your Event Ticket</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Your Event Ticket</p>
            <p className="text-xs text-muted-foreground">Bring this code to check in</p>
          </div>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">
          <AttendanceQRCode
            ref={ticketRef}
            activityId={activityId}
            userId={userId}
            activityTitle={activityTitle}
            activityDate={activityDate}
            activityTime={activityTime}
            location={location}
            userName={userName}
            ticketNumber={ticketCode}
            onDownload={handleDownload}
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
