"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"
import { facilities } from "@/lib/mock-data"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface FacilitiesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const filters = ["All", "Available", "Free", "Indoor", "Outdoor", "Multi-Sport"]

export function FacilitiesPage({ onNavigate }: FacilitiesPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Facilities</h1>
        <p className="text-sm text-muted-foreground">
          Find and book sports facilities near you
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search facilities..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4 text-foreground" />
        </button>
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden md:inline">Map View</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeFilter === filter
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onClick={() => onNavigate("facility-detail", facility.id)}
          />
        ))}
      </div>
    </div>
  )
}
