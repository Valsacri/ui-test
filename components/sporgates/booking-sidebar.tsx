"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Clock, Users } from "lucide-react"

interface BookingSidebarProps {
  pricePerHour: number
  capacity: number
  itemName: string
  onBooking?: (date: string, time: string, duration: number, participants: number) => void
}

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
]

export function BookingSidebar({ pricePerHour, capacity, itemName, onBooking }: BookingSidebarProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState(1)
  const [participants, setParticipants] = useState(1)

  const subtotal = useMemo(() => pricePerHour * duration, [pricePerHour, duration])
  const serviceFee = useMemo(() => subtotal * 0.1, [subtotal])
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee])

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

      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">Select date</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-3 text-xs outline-none focus:border-primary"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {date && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground">Select time</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={
                  time === slot
                    ? "rounded-xl bg-primary px-3 py-2 text-[11px] font-semibold text-white"
                    : "rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-muted"
                }
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">Duration (hours)</label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
          <button
            type="button"
            onClick={() => setDuration(Math.max(1, duration - 1))}
            className="rounded-full bg-muted px-2 text-sm font-semibold text-foreground"
          >
            -
          </button>
          <span className="flex-1 text-center text-sm font-semibold text-foreground">{duration}</span>
          <button
            type="button"
            onClick={() => setDuration(duration + 1)}
            className="rounded-full bg-muted px-2 text-sm font-semibold text-foreground"
          >
            +
          </button>
        </div>
      </div>

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

      {pricePerHour > 0 && date && time && (
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

      <button
        type="button"
        onClick={() => onBooking?.(date, time, duration, participants)}
        disabled={!date || !time}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pricePerHour === 0 ? "Reserve Spot" : "Request Booking"}
      </button>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Free cancellation up to 24 hours before start time.</span>
      </div>
    </aside>
  )
}
