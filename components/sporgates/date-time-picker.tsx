"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {  label?: string
  value?: string
  onChange: (value: string) => void
  type: "date" | "time"
  required?: boolean
  id?: string
  placeholder?: string
  minDate?: string
}

const formatDisplayDate = (date: Date | undefined, placeholder?: string) => {
  if (!date) return placeholder || "Select date"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const formatDisplayTime = (time: string, placeholder?: string) => {
  if (!time) return placeholder || "Select time"
  const [hours, minutes] = time.split(":")
  const hour = Number(hours)
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour >= 12 ? "PM" : "AM"
  return `${hour12}:${minutes} ${ampm}`
}

const buildTimeSlots = () => {
  const slots: Array<{ value: string; label: string }> = []
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = hour.toString().padStart(2, "0")
      const minuteStr = minute.toString().padStart(2, "0")
      const value = `${hourStr}:${minuteStr}`
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const ampm = hour >= 12 ? "PM" : "AM"
      slots.push({ value, label: `${hour12}:${minuteStr} ${ampm}` })
    }
  }
  return slots
}

export function DateTimePicker({
  label,
  value = "",
  onChange,
  type,
  required = false,
  id,
  placeholder,
  minDate,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")

  useEffect(() => {
    if (type === "date") {
      setSelectedDate(value ? new Date(value) : undefined)
    } else {
      setSelectedTime(value)
    }
  }, [type, value])

  const timeSlots = useMemo(() => buildTimeSlots(), [])
  const minDateValue = minDate ? new Date(minDate) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    onChange(date.toISOString().split("T")[0])
    setOpen(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onChange(time)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-xs">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-left text-sm"
          >
            <span className={cn("text-sm", (type === "date" ? selectedDate : selectedTime) ? "text-foreground" : "text-muted-foreground")}>
              {type === "date"
                ? formatDisplayDate(selectedDate, placeholder)
                : formatDisplayTime(selectedTime, placeholder)}
            </span>
            {type === "date" ? (
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-4">
          {type === "date" ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={minDateValue ? (date) => date < minDateValue : undefined}
            />
          ) : (
            <div className="max-h-64 w-48 space-y-1 overflow-y-auto">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => handleTimeSelect(slot.value)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-xs transition-colors",
                    slot.value === selectedTime ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
