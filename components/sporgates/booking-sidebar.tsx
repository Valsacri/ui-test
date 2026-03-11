"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Clock, Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { bookingService } from "@/lib/services/booking"

interface AvailabilitySlot {
  startTime: string
  endTime: string
  available: boolean
}

interface BookingSidebarProps {
  facilityId: string
  pricePerHour: number
  capacity: number
  itemName: string
  onBookingSuccess?: () => void
}

export function BookingSidebar({ facilityId, pricePerHour, capacity, itemName, onBookingSuccess }: BookingSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [participants, setParticipants] = useState(1)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const [bookingResult, setBookingResult] = useState<"success" | "error" | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  // Fetch real availability when date changes
  useEffect(() => {
    if (!date || !facilityId) {
      setSlots([])
      setSelectedSlots([])
      return
    }
    const dateStr = format(date, "yyyy-MM-dd")
    setLoading(true)
    setBookingResult(null)
    bookingService
      .checkAvailability(facilityId, dateStr)
      .then((data: AvailabilitySlot[]) => {
        const available = Array.isArray(data) ? data : []
        setSlots(available)
        setSelectedSlots([])
      })
      .catch(() => {
        setSlots([])
        setSelectedSlots([])
      })
      .finally(() => setLoading(false))
  }, [date, facilityId])

  const availableSlots = useMemo(() => slots.filter((s) => s.available), [slots])

  const toggleSlot = (startTime: string) => {
    setSelectedSlots((prev) =>
      prev.includes(startTime) ? prev.filter((s) => s !== startTime) : [...prev, startTime]
    )
  }

  const duration = selectedSlots.length
  const subtotal = useMemo(() => pricePerHour * duration, [pricePerHour, duration])
  const serviceFee = useMemo(() => subtotal * 0.1, [subtotal])
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee])

  const handleBooking = async () => {
    if (!date || selectedSlots.length === 0) return
    setBooking(true)
    setBookingResult(null)
    try {
      const dateStr = format(date, "yyyy-MM-dd")

      if (selectedSlots.length === 1) {
        const slot = slots.find((s) => s.startTime === selectedSlots[0])
        if (slot) {
          await bookingService.createBooking({
            facilityId,
            date: dateStr,
            startTime: slot.startTime,
            endTime: slot.endTime,
            duration: 1,
          })
        }
      } else {
        const timeRanges = selectedSlots
          .map((st) => slots.find((s) => s.startTime === st))
          .filter(Boolean)
          .map((slot) => ({
            startDateTime: `${dateStr}T${slot!.startTime}:00`,
            endDateTime: `${dateStr}T${slot!.endTime}:00`,
          }))
        await bookingService.createMultiSlotBooking({
          facilityId,
          timeRanges,
        })
      }
      setBookingResult("success")
      onBookingSuccess?.()
    } catch (err: unknown) {
      setBookingResult("error")
      setErrorMsg(err instanceof Error ? err.message : "Booking failed. Please try again.")
    } finally {
      setBooking(false)
    }
  }

  const formatSlotLabel = (time: string) => {
    try {
      const [h, m] = time.split(":").map(Number)
      const period = h >= 12 ? "PM" : "AM"
      const hour = h % 12 || 12
      return `${hour}:${(m ?? 0).toString().padStart(2, "0")} ${period}`
    } catch {
      return time
    }
  }

  return (
    <aside className="sticky top-20 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Booking</p>
        <h3 className="text-lg font-bold text-foreground">{itemName}</h3>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-muted-foreground">Price</p>
        <p className="text-3xl font-bold text-primary">
          {pricePerHour === 0 ? "Free" : `$${pricePerHour}`}
        </p>
        {pricePerHour > 0 && <p className="text-xs text-muted-foreground">per hour</p>}
      </div>

      {/* Date picker */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">Select date</label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-10 w-full items-center gap-2 rounded-full border border-border bg-muted px-3 text-xs outline-none transition-colors hover:bg-muted/80 focus:border-primary",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              {date ? format(date, "PPP") : "Pick a date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time slots — real availability */}
      {date && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground">
            Select time {selectedSlots.length > 0 && `(${selectedSlots.length} selected)`}
          </label>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-xs text-muted-foreground">Loading availability...</span>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">No available slots for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlots.includes(slot.startTime)
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => toggleSlot(slot.startTime)}
                    className={
                      isSelected
                        ? "rounded-xl bg-primary px-3 py-2 text-[11px] font-semibold text-white"
                        : "rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-muted"
                    }
                  >
                    {formatSlotLabel(slot.startTime)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Participants */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">Participants</label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
          <button
            type="button"
            onClick={() => setParticipants(Math.max(1, participants - 1))}
            className="rounded-full bg-muted px-2 text-sm font-semibold text-foreground"
          >
            -
          </button>
          <span className="flex-1 text-center text-sm font-semibold text-foreground">{participants}</span>
          <button
            type="button"
            onClick={() => setParticipants(Math.min(capacity, participants + 1))}
            className="rounded-full bg-muted px-2 text-sm font-semibold text-foreground"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>Max capacity: {capacity}</span>
        </div>
      </div>

      {/* Price summary */}
      {pricePerHour > 0 && date && selectedSlots.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">${pricePerHour} x {duration} hr</span>
            <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span className="font-semibold text-foreground">${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Booking result */}
      {bookingResult === "success" && (
        <div className="flex items-center gap-2 rounded-xl bg-green-500/10 p-3 text-xs text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Booking confirmed! You&apos;ll receive a confirmation.</span>
        </div>
      )}
      {bookingResult === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleBooking}
        disabled={!date || selectedSlots.length === 0 || booking}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {booking ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Booking...
          </span>
        ) : pricePerHour === 0 ? (
          "Reserve Spot"
        ) : (
          "Request Booking"
        )}
      </button>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Free cancellation up to 24 hours before start time.</span>
      </div>
    </aside>
  )
}
