"use client"

import { useState, useEffect } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExploreFilterState {
  contentTypes: string[]
  distance: number
  rating: string
}

interface ExploreFilterSidebarProps {
  onClose?: () => void
  onApply?: (filters: ExploreFilterState) => void
  currentFilters?: ExploreFilterState
}

const contentTypes = ["Activities", "Facilities", "Services", "Businesses", "People"]
const ratings = ["Any", "4.0+", "4.5+", "5.0"]

export function ExploreFilterSidebar({ onClose, onApply, currentFilters }: ExploreFilterSidebarProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentFilters?.contentTypes ?? [])
  const [distance, setDistance] = useState(currentFilters?.distance ?? 10)
  const [rating, setRating] = useState(currentFilters?.rating ?? "Any")

  useEffect(() => {
    if (currentFilters) {
      setSelectedTypes(currentFilters.contentTypes)
      setDistance(currentFilters.distance)
      setRating(currentFilters.rating)
    }
  }, [currentFilters])

  const resetFilters = () => {
    setSelectedTypes([])
    setDistance(10)
    setRating("Any")
    onApply?.({ contentTypes: [], distance: 10, rating: "Any" })
    onClose?.()
  }

  const applyFilters = () => {
    onApply?.({ contentTypes: selectedTypes, distance, rating })
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
          <p className="mb-2 text-xs font-semibold text-foreground">Content Type</p>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setSelectedTypes((prev) =>
                    prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
                  )
                }
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  selectedTypes.includes(type)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Distance</p>
          <input
            type="range"
            min={1}
            max={30}
            value={distance}
            onChange={(event) => setDistance(Number(event.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>1 mi</span>
            <span>{distance} mi</span>
            <span>30 mi</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Rating</p>
          <div className="flex flex-wrap gap-2">
            {ratings.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  rating === value
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {value}
              </button>
            ))}
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
