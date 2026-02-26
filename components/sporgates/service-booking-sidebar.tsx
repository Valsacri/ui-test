"use client"

import { useState } from "react"
import { CalendarDays, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ServiceBookingSidebarProps {
  serviceName: string
  serviceImage: string
  provider: string
  price: number
  duration: string
  rating: number
  reviews: number
  verified: boolean
  onBooking?: (date: string, time: string, notes: string) => void
}

export function ServiceBookingSidebar({
  serviceName,
  serviceImage,
  provider,
  price,
  duration,
  rating,
  reviews,
  verified,
  onBooking,
}: ServiceBookingSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")

  return (
    <aside className="sticky top-20 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="flex gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted">
          <img src={serviceImage} alt={serviceName} className="h-full w-full object-cover" crossOrigin="anonymous" />
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

      {date && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground">Preferred time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {date && time && (
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

      <button
        type="button"
        onClick={() => onBooking?.(date ? format(date, "yyyy-MM-dd") : "", time, notes)}
        disabled={!date || !time}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {date && time ? "Confirm Booking" : "Select Date & Time"}
      </button>

      <p className="text-[11px] text-muted-foreground">You will not be charged until the provider confirms.</p>
    </aside>
  )
}
