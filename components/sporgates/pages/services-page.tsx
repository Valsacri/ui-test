"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Search, Wrench } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { mapService } from "@/lib/mappers/explore-mappers"
import type { ServiceListingDto } from "@/lib/types/explore"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { LoadingGrid, LoadingActivityCard } from "@/components/sporgates/ux/loading-cards"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface ServicesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const categories = ["All", "Training", "Recovery", "Wellness", "Coaching"]

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(9)

  const { data: rawServices = [], error, isLoading, mutate } = useSWR<ServiceListingDto[]>('/v1/services', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const services = useMemo(() => rawServices.map(mapService), [rawServices])

  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      if (activeCategory !== "All" && service.category !== activeCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !service.name?.toLowerCase().includes(q) &&
          !service.category?.toLowerCase().includes(q) &&
          !service.provider?.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
    return result
  }, [services, activeCategory, searchQuery])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-sm text-muted-foreground">
          Book training, wellness, and recovery services
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services..."
          aria-label="Search services"
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeCategory === cat
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingGrid className="md:grid-cols-2 lg:grid-cols-3">
          <LoadingActivityCard />
        </LoadingGrid>
      ) : error ? (
        <ErrorState
          title="Couldn't load services"
          message="We ran into an error fetching the available services."
          onRetry={() => mutate()}
        />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services found"
          description="Try adjusting your filters or search query"
          action={{
            label: "Clear Filters",
            onClick: () => {
              setActiveCategory("All")
              setSearchQuery("")
            },
            variant: "secondary",
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.slice(0, visibleCount).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => onNavigate("service-detail", service.id)}
              />
            ))}
          </div>
          {visibleCount < filteredServices.length && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:shadow-md"
              >
                Show More ({filteredServices.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}