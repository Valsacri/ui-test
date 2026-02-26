"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Search, SlidersHorizontal, MapPin, Building2 } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { DEFAULT_API_BASE_URL } from "@/lib/constants"
import { BusinessCard } from "@/components/sporgates/cards/business-card"
import { SortFilter } from "@/components/sporgates/filters/sort-filter"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { LoadingGrid, LoadingFacilityCard } from "@/components/sporgates/ux/loading-cards"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface BusinessesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const filters = ["All", "Sports Complex", "Gym & Training", "Tennis Academy", "Aquatics Center"]

export function BusinessesPage({ onNavigate }: BusinessesPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  const { data: rawData, isLoading: loading } = useSWR<any>('/v1/businesses', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const businesses: any[] = useMemo(() => {
    const list = Array.isArray(rawData) ? rawData : (rawData?.content || [])
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
    return list.map((b: any) => ({
      id: b.id,
      name: b.name || "Unnamed Business",
      type: (b.bio && b.bio.length > 60) ? b.bio.slice(0, 60) + "…" : (b.bio || "Business"),
      location: [b.city, b.state].filter(Boolean).join(", ") || b.address || "—",
      rating: b.rating || 0,
      reviews: b.reviews || 0,
      image: b.cover
        ? (b.cover.startsWith("/") ? `${apiUrl}${b.cover}` : b.cover)
        : b.avatar
          ? (b.avatar.startsWith("/") ? `${apiUrl}${b.avatar}` : b.avatar)
          : "",
      followers: b.followers || 0,
      activities: b.activities || 0,
      verified: !!b.verifiedAt,
    }))
  }, [rawData])

  const filteredBusinesses = useMemo(() => {
    let result = businesses.filter((b) => {
      const matchesFilter = activeFilter === "All" || b.type === activeFilter
      const matchesQuery = !query || b.name.toLowerCase().includes(query.toLowerCase()) || b.type.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "followers":
          return b.followers - a.followers
        case "activities":
          return b.activities - a.activities
        case "newest":
          return Number(b.id) - Number(a.id)
        default:
          return 0
      }
    })

    return result
  }, [activeFilter, query, sortBy, businesses])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Businesses</h1>
        <p className="text-sm text-muted-foreground">
          Discover sports businesses, venues, and organizers
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses..."
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
          <span className="hidden md:inline">Near Me</span>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredBusinesses.length}</span> businesses found
        </p>
        <SortFilter
          value={sortBy}
          onValueChange={setSortBy}
          options={[
            { value: "rating", label: "Sort by: Rating" },
            { value: "followers", label: "Most Followers" },
            { value: "activities", label: "Most Activities" },
            { value: "newest", label: "Newest" },
          ]}
        />
      </div>

      {loading ? (
        <LoadingGrid className="md:grid-cols-2 lg:grid-cols-3">
          <LoadingFacilityCard />
        </LoadingGrid>
      ) : filteredBusinesses.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No businesses found"
          description={query ? "Try adjusting your search or filters" : "Check back later for new businesses"}
          action={
            query || activeFilter !== "All"
              ? {
                label: "Clear Filters",
                onClick: () => {
                  setActiveFilter("All")
                  setQuery("")
                },
                variant: "secondary",
              }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onClick={() => onNavigate("business-detail", business.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
