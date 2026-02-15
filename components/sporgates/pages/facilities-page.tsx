"use client"

import { useMemo, useState, useEffect } from "react"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"
import { facilities as mockFacilities } from "@/lib/mock-data"
import { facilitiesService } from "@/lib/services"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import { FacilitiesFilterSidebar } from "@/components/sporgates/filters/facilities-filter-sidebar"
import { MapFilter } from "@/components/sporgates/map-filter"
import { MapView } from "@/components/sporgates/map-view"
import { BottomSheet } from "@/components/sporgates/ux/bottom-sheet"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { LoadingFacilityCard, LoadingGrid } from "@/components/sporgates/ux/loading-cards"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { SortFilter } from "@/components/sporgates/filters/sort-filter"

interface FacilitiesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const filters = ["All", "Available", "Free", "Indoor", "Outdoor", "Multi-Sport"]

export function FacilitiesPage({ onNavigate }: FacilitiesPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [facilities, setFacilities] = useState(mockFacilities)
  const mapCenter = facilities[0]?.coordinates || [40.7465, -74.0071]
  const [sortBy, setSortBy] = useState("relevance")
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    facilitiesService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) setFacilities(data)
    }).catch(() => { }).finally(() => setIsLoading(false))
  }, [])

  const filteredFacilities = useMemo(() => {
    let result = facilities.filter((f) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          f.name.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }

      // Pill filter
      if (activeFilter !== "All") {
        switch (activeFilter) {
          case "Available":
            if (!f.available) return false
            break
          case "Free":
            if (f.pricePerHour !== 0) return false
            break
          case "Indoor":
            if (f.type.toLowerCase().includes("outdoor")) return false
            break
          case "Outdoor":
            if (!f.type.toLowerCase().includes("outdoor")) return false
            break
          case "Multi-Sport":
            if (f.sports.length <= 1) return false
            break
        }
      }

      return true
    })

    // Sort
    if (sortBy !== "relevance") {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.pricePerHour - b.pricePerHour
          case "price-high":
            return b.pricePerHour - a.pricePerHour
          case "rating":
            return b.rating - a.rating
          case "distance":
            return 0 // Distance would need geolocation — keep original order
          default:
            return 0
        }
      })
    }

    return result
  }, [facilities, searchQuery, activeFilter, sortBy])

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facilities..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4 text-foreground" />
        </button>
        <button
          type="button"
          onClick={() => setShowMap((prev) => !prev)}
          className={cn(
            "flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted",
            showMap && "bg-primary text-primary-foreground border-primary"
          )}
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden md:inline">{showMap ? "Hide Map" : "Map View"}</span>
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

      {showFilters && isMobile && (
        <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filters">
          <FacilitiesFilterSidebar onClose={() => setShowFilters(false)} />
        </BottomSheet>
      )}

      {showFilters && !isMobile && (
        <FacilitiesFilterSidebar onClose={() => setShowFilters(false)} />
      )}

      {showMap && (
        <div className="space-y-4">
          <MapFilter />
          <MapView center={mapCenter as [number, number]} markerLabel="Facility cluster" height="300px" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredFacilities.length}</span> facilities found
        </p>
        <SortFilter
          value={sortBy}
          onValueChange={setSortBy}
          options={[
            { value: "relevance", label: "Sort by: Relevance" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "rating", label: "Rating" },
            { value: "distance", label: "Distance" },
          ]}
        />
      </div>

      {isLoading ? (
        <LoadingGrid className="md:grid-cols-2">
          <LoadingFacilityCard />
        </LoadingGrid>
      ) : filteredFacilities.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No facilities found"
          description="Try adjusting your filters or map radius."
          action={{
            label: "Clear Filters",
            onClick: () => {
              setActiveFilter("All")
              setSearchQuery("")
            },
            variant: "secondary",
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredFacilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onClick={() => onNavigate("facility-detail", facility.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
