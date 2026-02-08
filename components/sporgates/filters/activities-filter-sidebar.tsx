"use client"

import { useState } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivitiesFilterSidebarProps {
  onClose?: () => void
  onApply?: (filters: ActivitiesFilterState) => void
}

export interface ActivitiesFilterState {
  sports: string[]
  priceRange: string
  timeOfDay: string
  level: string
}

const sports = ["Basketball", "Soccer", "Tennis", "Swimming", "Running", "Volleyball", "Boxing", "Yoga"]
const priceRanges = ["Any", "Free", "Under $25", "$25-$50", "$50+"]
const times = ["Any", "Morning", "Afternoon", "Evening"]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export function ActivitiesFilterSidebar({ onClose, onApply }: ActivitiesFilterSidebarProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState("Any")
  const [timeOfDay, setTimeOfDay] = useState("Any")
  const [level, setLevel] = useState("All Levels")

  const resetFilters = () => {
    setSelectedSports([])
    setPriceRange("Any")
    setTimeOfDay("Any")
    setLevel("All Levels")
  }

  const applyFilters = () => {
    onApply?.({ sports: selectedSports, priceRange, timeOfDay, level })
    onClose?.()
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-slide-in-up">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Sports</p>
          <div className="flex flex-wrap gap-2">
            {sports.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() =>
                  setSelectedSports((prev) =>
                    prev.includes(sport) ? prev.filter((item) => item !== sport) : [...prev, sport]
                  )
                }
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  selectedSports.includes(sport)
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Price Range</p>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setPriceRange(range)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  priceRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold text-foreground">Time of Day</p>
            <select
              value={timeOfDay}
              onChange={(event) => setTimeOfDay(event.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-xs outline-none"
            >
              {times.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-foreground">Skill Level</p>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-xs outline-none"
            >
              {levels.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
