"use client"

import { useState } from "react"
import { Camera, CameraOff, CheckCircle2, AlertCircle, ScanLine } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ScanResult {
  ticketNumber: string
  userId: string
  activityId: string
  timestamp: string
  status: "valid" | "invalid" | "duplicate"
  message?: string
}

interface QRScannerProps {
  activityId: string
  onScanSuccess?: (result: ScanResult) => void
  onScanError?: (error: string) => void
  checkedInUsers?: string[]
}

export function QRScanner({ activityId, onScanSuccess, onScanError, checkedInUsers = [] }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanInput, setScanInput] = useState("")
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)

  const toggleScanning = () => {
    setIsScanning((prev) => !prev)
  }

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput)
      if (data.type !== "SPORGATES_ATTENDANCE" || data.activityId !== activityId) {
        const invalidResult = {
          ticketNumber: data.ticketNumber || "UNKNOWN",
          userId: data.userId || "",
          activityId: data.activityId || "",
          timestamp: new Date().toISOString(),
          status: "invalid" as const,
          message: "Invalid ticket for this activity",
        }
        setLastScan(invalidResult)
        onScanError?.("Invalid ticket")
        return
      }

      if (checkedInUsers.includes(data.userId)) {
        const duplicateResult = {
          ticketNumber: data.ticketNumber,
          userId: data.userId,
          activityId: data.activityId,
          timestamp: data.timestamp || new Date().toISOString(),
          status: "duplicate" as const,
          message: "Already checked in",
        }
        setLastScan(duplicateResult)
        onScanError?.("Duplicate check-in")
        return
      }

      const validResult = {
        ticketNumber: data.ticketNumber,
        userId: data.userId,
        activityId: data.activityId,
        timestamp: data.timestamp || new Date().toISOString(),
        status: "valid" as const,
        message: "Check-in successful",
      }
      setLastScan(validResult)
      onScanSuccess?.(validResult)
      setScanInput("")
    } catch {
      setLastScan({
        ticketNumber: "UNKNOWN",
        userId: "",
        activityId: "",
        timestamp: new Date().toISOString(),
        status: "invalid",
        message: "Unable to parse QR code",
      })
      onScanError?.("Invalid QR data")
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Attendance Scanner</h3>
        </div>
        <button
          type="button"
          onClick={toggleScanning}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {isScanning ? (
            <span className="flex items-center gap-1">
              <CameraOff className="h-3.5 w-3.5" /> Stop
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Camera className="h-3.5 w-3.5" /> Start
            </span>
          )}
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center">
        <div className={cn(
          "mx-auto flex h-40 w-full max-w-xs items-center justify-center rounded-xl border border-border bg-card",
          isScanning ? "border-primary" : "border-border"
        )}>
          <div>
            <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Camera preview placeholder</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Paste a ticket payload below to simulate a scan.</p>
      </div>

      <div className="mt-4 space-y-2">
        <textarea
          value={scanInput}
          onChange={(event) => setScanInput(event.target.value)}
          rows={3}
          placeholder='{"type":"SPORGATES_ATTENDANCE","activityId":"1","userId":"U-1","ticketNumber":"TKT-1"}'
          className="w-full rounded-xl border border-border bg-muted p-3 text-xs outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleScan}
          className="gradient-primary w-full rounded-xl py-2 text-xs font-semibold text-white"
        >
          Validate Ticket
        </button>
      </div>

      {lastScan && (
        <div
          className={cn(
            "mt-4 rounded-xl border px-3 py-2 text-xs",
            lastScan.status === "valid" && "border-green-200 bg-green-50 text-green-700",
            lastScan.status === "invalid" && "border-red-200 bg-red-50 text-red-700",
            lastScan.status === "duplicate" && "border-yellow-200 bg-yellow-50 text-yellow-700"
          )}
        >
          <div className="flex items-center gap-2">
            {lastScan.status === "valid" && <CheckCircle2 className="h-4 w-4" />}
            {lastScan.status !== "valid" && <AlertCircle className="h-4 w-4" />}
            <span className="font-semibold">{lastScan.message}</span>
          </div>
          <p className="mt-1">Ticket: {lastScan.ticketNumber}</p>
        </div>
      )}
    </div>
  )
}
