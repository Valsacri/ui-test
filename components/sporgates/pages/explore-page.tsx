"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"
import { activities, facilities, services, businesses, people } from "@/lib/mock-data"
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

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const [activeTab, setActiveTab] = useState("All")
  const [activeSport, setActiveSport] = useState("All Sports")
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [joinedRecommendations, setJoinedRecommendations] = useState<string[]>([])
  const mapCenter = facilities[0]?.coordinates || [40.7465, -74.0071]
  const isMobile = useIsMobile()
  const recommendations = activities.slice(0, 3)
  const reasons = [
    "Matches your favorite sports",
    "Trending near your area",
    "Similar to recent bookings",
  ]

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
              "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted",
              showMap && "bg-primary text-primary-foreground border-primary"
            )}
          >
            <MapPin className="h-4 w-4 text-foreground" />
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

        {showFilters && isMobile && (
          <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filters">
            <ExploreFilterSidebar onClose={() => setShowFilters(false)} />
          </BottomSheet>
        )}

        {showFilters && !isMobile && (
          <ExploreFilterSidebar onClose={() => setShowFilters(false)} />
        )}

        {showMap && (
          <div className="space-y-4">
            <MapFilter />
            <MapView center={mapCenter as [number, number]} markerLabel="Nearby locations" height="300px" />
          </div>
        )}
      </div>

      {/* Results */}
      {activeTab === "All" && (
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
                onJoin={(id) => setJoinedRecommendations((prev) => [...prev, id])}
              />
            ))}
          </div>
        </div>
      )}

      {(activeTab === "All" || activeTab === "Activities") && (
        <div>
          <h2 className="mb-4 text-base font-bold text-foreground">Activities</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => onNavigate("activity-detail", activity.id)}
              />
            ))}
          </div>
        </div>
      )}

      {(activeTab === "All" || activeTab === "Facilities") && (
        <div>
          <h2 className="mb-4 text-base font-bold text-foreground">Facilities</h2>
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
      )}

      {(activeTab === "All" || activeTab === "Services") && (
        <div>
          <h2 className="mb-4 text-base font-bold text-foreground">Services</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => onNavigate("service-detail", service.id)}
              />
            ))}
          </div>
        </div>
      )}

      {(activeTab === "All" || activeTab === "Businesses") && (
        <div>
          <h2 className="mb-4 text-base font-bold text-foreground">Businesses</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={() => onNavigate("business-detail", business.id)}
              />
            ))}
          </div>
        </div>
      )}

      {(activeTab === "All" || activeTab === "People") && (
        <div>
          <h2 className="mb-4 text-base font-bold text-foreground">People</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onClick={() => onNavigate("person-detail", person.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
