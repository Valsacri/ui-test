"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react"
import { activities } from "@/lib/mock-data"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { ActivitiesFilterSidebar } from "@/components/sporgates/filters/activities-filter-sidebar"
import { BottomSheet } from "@/components/sporgates/ux/bottom-sheet"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { LoadingActivityCard, LoadingGrid } from "@/components/sporgates/ux/loading-cards"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ActivitiesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const filters = ["All", "Today", "This Week", "Free", "Paid", "Indoor", "Outdoor"]

export function ActivitiesPage({ onNavigate }: ActivitiesPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useIsMobile()
  const isLoading = false

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activities</h1>
        <p className="text-sm text-muted-foreground">
          Discover and join sports activities near you
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
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
        <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 md:flex">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-full p-1.5 transition-colors",
              viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-full p-1.5 transition-colors",
              viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
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
        <BottomSheet
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filters"
        >
          <ActivitiesFilterSidebar onClose={() => setShowFilters(false)} />
        </BottomSheet>
      )}

      {showFilters && !isMobile && (
        <ActivitiesFilterSidebar onClose={() => setShowFilters(false)} />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{activities.length}</span> activities found
        </p>
        <select className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs outline-none">
          <option>Sort by: Relevance</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating</option>
          <option>Date</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingGrid>
          <LoadingActivityCard />
        </LoadingGrid>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No activities found"
          description="Try adjusting your filters or search query."
          action={{
            label: "Clear Filters",
            onClick: () => setActiveFilter("All"),
            variant: "secondary",
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => onNavigate("activity-detail", activity.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
