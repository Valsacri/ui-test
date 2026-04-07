"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock, CheckCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
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

interface ServiceBookingSidebarProps {
  serviceId: string
  serviceName: string
  serviceImage: string
  provider: string
  price: number
  duration: string
  rating: number
  reviews: number
  verified: boolean
  onBookingSuccess?: () => void
}

export function ServiceBookingSidebar({
  serviceId,
  serviceName,
  serviceImage,
  provider,
  price,
  duration,
  rating,
  reviews,
  verified,
  onBookingSuccess,
}: ServiceBookingSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [notes, setNotes] = useState("")
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const [bookingResult, setBookingResult] = useState<"success" | "error" | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  // Fetch real service availability when date changes
  useEffect(() => {
    if (!date || !serviceId) {
      setSlots([])
      setSelectedSlot(null)
      return
    }
    const dateStr = format(date, "yyyy-MM-dd")
    setLoading(true)
    setBookingResult(null)
    bookingService
      .checkServiceAvailability(serviceId, dateStr)
      .then((data: AvailabilitySlot[]) => {
        const available = Array.isArray(data) ? data : []
        setSlots(available)
        setSelectedSlot(null)
      })
      .catch(() => {
        setSlots([])
        setSelectedSlot(null)
      })
      .finally(() => setLoading(false))
  }, [date, serviceId])

  const availableSlots = slots.filter((s) => s.available)

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

  const handleBooking = async () => {
    if (!date || !selectedSlot) return
    setBooking(true)
    setBookingResult(null)
    try {
      await bookingService.createServiceBooking({
        serviceId,
        date: format(date, "yyyy-MM-dd"),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: notes || undefined,
      })
      setBookingResult("success")
      onBookingSuccess?.()
    } catch (err: unknown) {
      setBookingResult("error")
      setErrorMsg(err instanceof Error ? err.message : "Booking failed. Please try again.")
    } finally {
      setBooking(false)
    }
  }

  return (
    <aside className="sticky top-20 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="flex gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted">
          <img src={serviceImage} alt={serviceName} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{serviceName}</p>
          <p className="text-xs text-muted-foreground">{provider}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-secondary">★</span>
            <span>{rating}</span>
            <span>({reviews})</span>
            {verified && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs text-muted-foreground">Session Price</p>
        <p className="text-3xl font-bold text-primary">${price}</p>
        <p className="text-xs text-muted-foreground">{duration} session</p>
      </div>

      {/* Date picker */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">Preferred date</label>
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

      {/* Time slots from API */}
      {date && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground">Available time</label>
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
                const isSelected = selectedSlot?.startTime === slot.startTime
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => setSelectedSlot(isSelected ? null : slot)}
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

      {/* Notes */}
      {date && selectedSlot && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Share your goals or requests..."
            className="w-full rounded-xl border border-border bg-muted p-3 text-xs outline-none focus:border-primary"
          />
        </div>
      )}

      {/* Booking result */}
      {bookingResult === "success" && (
        <div className="flex items-center gap-2 rounded-xl bg-green-500/10 p-3 text-xs text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Booking confirmed! The provider will be notified.</span>
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
        disabled={!date || !selectedSlot || booking}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {booking ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Booking...
          </span>
        ) : date && selectedSlot ? (
          "Confirm Booking"
        ) : (
          "Select Date & Time"
        )}
      </button>

      <p className="text-[11px] text-muted-foreground">You will not be charged until the provider confirms.</p>
    </aside>
  )
}
