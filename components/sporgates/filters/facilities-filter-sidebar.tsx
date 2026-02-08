"use client"

import { useState } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface FacilitiesFilterSidebarProps {
  onClose?: () => void
  onApply?: (filters: FacilitiesFilterState) => void
}

export interface FacilitiesFilterState {
  availability: string
  priceRange: string
  amenities: string[]
}

const availabilityOptions = ["Any", "Available Now", "Free", "Premium"]
const priceRanges = ["Any", "Free", "Under $25", "$25-$50", "$50+"]
const amenities = ["Parking", "Lockers", "Showers", "Pro Shop", "Cafe", "Training"]

export function FacilitiesFilterSidebar({ onClose, onApply }: FacilitiesFilterSidebarProps) {
  const [availability, setAvailability] = useState("Any")
  const [priceRange, setPriceRange] = useState("Any")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const resetFilters = () => {
    setAvailability("Any")
    setPriceRange("Any")
    setSelectedAmenities([])
  }

  const applyFilters = () => {
    onApply?.({ availability, priceRange, amenities: selectedAmenities })
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
          <p className="mb-2 text-xs font-semibold text-foreground">Availability</p>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAvailability(option)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  availability === option
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {option}
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
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() =>
                  setSelectedAmenities((prev) =>
                    prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
                  )
                }
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  selectedAmenities.includes(amenity)
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {amenity}
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
