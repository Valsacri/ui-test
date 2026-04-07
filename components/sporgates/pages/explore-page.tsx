"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, MapPin, Building2, ArrowRight, SearchX } from "lucide-react"
import { toast } from "sonner"
import { useExplore } from "@/hooks/use-explore"
import { activitiesService } from "@/lib/services/activities"
import { authService } from "@/lib/services/auth"
import { squadService } from "@/lib/services/squad"
import useSWR from "swr"
import { getApiErrorMessage } from "@/lib/api-errors"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import { BusinessCard } from "@/components/sporgates/cards/business-card"
import { PersonCard } from "@/components/sporgates/cards/person-card"
import { RecommendationActivityCard } from "@/components/sporgates/cards/recommendation-activity-card"
import { ExploreFilterSidebar } from "@/components/sporgates/filters/explore-filter-sidebar"
import { MapFilter } from "@/components/sporgates/map-filter"
import { MapView } from "@/components/sporgates/map-view"
import { BottomSheet } from "@/components/sporgates/ux/bottom-sheet"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ExplorePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const tabs = ["All", "Activities", "Facilities", "Services", "Businesses", "People"]
const sportFilters = ["All Sports", "Basketball", "Soccer", "Tennis", "Swimming", "Running", "Volleyball", "Boxing", "Yoga"]

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card overflow-hidden">
      <div className="h-40 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">No {label} found</p>
      <p className="mt-1 text-xs text-muted-foreground/70">Try adjusting your search or filters</p>
    </div>
  )
}

function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const searchParams = useSearchParams()
  const {
    activities,
    facilities,
    services,
    businesses,
    people,
    loading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    activeSport,
    setActiveSport,
    sidebarFilters,
    applyFilters,
    totalResults,
    hostSquadId,
    setHostSquadId,
  } = useExplore()

  const [showFilters, setShowFilters] = useState(false)
  const currentUser = authService.getCurrentUser()
  const { data: userSquads = [] } = useSWR(
    currentUser?.id ? `/v1/squads/user/${currentUser.id}/explore` : null,
    () => squadService.getByUser(currentUser!.id),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )
  const squadsList = Array.isArray(userSquads) ? userSquads : []
  const showSquadActivityFilter =
    squadsList.length > 0 && (activeTab === "All" || activeTab === "Activities")

  useEffect(() => {
    const q = searchParams.get("q")
    if (q != null) setSearchQuery(q)
  }, [searchParams, setSearchQuery])
  const [showMap, setShowMap] = useState(false)
  const [joinedRecommendations, setJoinedRecommendations] = useState<string[]>([])
  const isMobile = useIsMobile()

  const mapCenter: [number, number] = facilities.find(f => f.coordinates[0] !== 0)?.coordinates || [40.7465, -74.0071]
  const recommendations = activities.slice(0, 3)
  const reasons = [
    "Matches your favorite sports",
    "Trending near your area",
    "Similar to recent bookings",
  ]

  const showSection = (section: string) => {
    if (sidebarFilters.contentTypes.length > 0 && !sidebarFilters.contentTypes.includes(section)) {
      return false
    }
    return activeTab === "All" || activeTab === section
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Search and Filters Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search everything..."
              aria-label="Search everything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {/* No spinner here when loading: the skeleton grid below is the single loading indicator. */}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted",
              showFilters && "bg-primary text-primary-foreground border-primary"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted",
              showMap && "bg-primary text-primary-foreground border-primary"
            )}
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                activeTab === tab
                  ? "gradient-primary text-white shadow-md"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sport Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sportFilters.map((sport) => (
            <button
              type="button"
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                activeSport === sport
                  ? "bg-secondary text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {sport}
            </button>
          ))}
        </div>

        {showSquadActivityFilter && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor="explore-host-squad" className="text-xs font-medium text-muted-foreground shrink-0">
              Squad-hosted activities
            </label>
            <select
              id="explore-host-squad"
              value={hostSquadId ?? ""}
              onChange={(e) => setHostSquadId(e.target.value || null)}
              className="h-10 w-full max-w-md rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:w-auto"
            >
              <option value="">All activities</option>
              {squadsList.map((s: { id: string; name?: string }) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.id}
                </option>
              ))}
            </select>
          </div>
        )}

        {showFilters && isMobile && (
          <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filters">
            <ExploreFilterSidebar
              onClose={() => setShowFilters(false)}
              onApply={applyFilters}
              currentFilters={sidebarFilters}
            />
          </BottomSheet>
        )}

        {showFilters && !isMobile && (
          <ExploreFilterSidebar
            onClose={() => setShowFilters(false)}
            onApply={applyFilters}
            currentFilters={sidebarFilters}
          />
        )}

        {showMap && (
          <div className="space-y-4">
            <MapFilter />
            <MapView center={mapCenter} markerLabel="Nearby locations" height="300px" />
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-6">
          {showSection("Activities") && (
            <div>
              <div className="mb-4 h-5 w-24 animate-pulse rounded bg-muted" />
              <LoadingGrid count={3} />
            </div>
          )}
          {showSection("Facilities") && (
            <div>
              <div className="mb-4 h-5 w-24 animate-pulse rounded bg-muted" />
              <LoadingGrid count={2} />
            </div>
          )}
        </div>
      )}

      {/* No results state */}
      {!loading && totalResults === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SearchX className="mb-4 h-14 w-14 text-muted-foreground/30" />
          <h3 className="text-base font-semibold text-foreground">No results found</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term or adjust your filters.`
              : "No data available. Try adjusting your sport or filter selections."}
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && totalResults > 0 && (
        <>
          {/* Recommended for you */}
          {activeTab === "All" && recommendations.length > 0 && (
            <div>
              <h2 className="mb-4 text-base font-bold text-foreground">Recommended for you</h2>
              <div className="space-y-3">
                {recommendations.map((activity, index) => (
                  <RecommendationActivityCard
                    key={activity.id}
                    id={activity.id}
                    title={activity.title}
                    sport={activity.sport}
                    location={activity.location}
                    date={activity.date}
                    time={activity.time}
                    participants={activity.spots}
                    maxParticipants={activity.totalSpots}
                    level="Intermediate"
                    image={activity.image}
                    reason={reasons[index % reasons.length]}
                    isJoined={joinedRecommendations.includes(activity.id)}
                    onJoin={async (id) => {
                      setJoinedRecommendations((prev) => [...prev, id])
                      try {
                        await activitiesService.bookActivity(id)
                        toast.success("You're in! 🎉 Check your tickets.")
                      } catch (err: any) {
                        setJoinedRecommendations((prev) => prev.filter((x) => x !== id))
                        toast.error(getApiErrorMessage(err, "Failed to join activity"))
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {showSection("Activities") && (
            <div>
              <h2 className="mb-4 text-base font-bold text-foreground">Activities</h2>
              {activities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onClick={() => onNavigate("activity-detail", activity.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState label="activities" />
              )}
            </div>
          )}

          {/* Facilities */}
          {showSection("Facilities") && (
            <div>
              <h2 className="mb-4 text-base font-bold text-foreground">Facilities</h2>
              {facilities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {facilities.map((facility) => (
                    <FacilityCard
                      key={facility.id}
                      facility={facility}
                      onClick={() => onNavigate("facility-detail", facility.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState label="facilities" />
              )}
            </div>
          )}

          {/* Services */}
          {showSection("Services") && (
            <div>
              <h2 className="mb-4 text-base font-bold text-foreground">Services</h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => onNavigate("service-detail", service.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState label="services" />
              )}
            </div>
          )}

          {/* Businesses */}
          {showSection("Businesses") && (
            <div>
              <h2 className="mb-4 text-base font-bold text-foreground">Businesses</h2>
              {businesses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {businesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      onClick={() => onNavigate("business-detail", business.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState label="businesses" />
              )}

              {/* Start Your Business CTA */}
              <button
                type="button"
                onClick={() => onNavigate("create-business")}
                className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 p-5 transition-all hover:border-primary/60 hover:shadow-md"
              >
                <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-foreground">Own a sports business?</p>
                  <p className="text-xs text-muted-foreground">
                    List your facility on Sporgates and reach thousands of athletes
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </button>
            </div>
          )}

          {/* People */}
          {showSection("People") && (
            <div>
              <h2 className="mb-4 text-base font-bold text-foreground">People</h2>
              {people.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {people.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      onClick={() => onNavigate("person-detail", person.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState label="people" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
