"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Calendar, MapPin, Star, Clock, Users } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { activitiesService } from "@/lib/services/activities"
import { facilitiesService } from "@/lib/services/facilities"
import { mapActivity } from "@/lib/mappers/explore-mappers"
import { mapFacility } from "@/lib/mappers/explore-mappers"
import type { ActivityCardData, FacilityCardData } from "@/lib/types/explore"
import { Skeleton } from "@/components/ui/skeleton"

interface FeedSidebarProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

function LoadingTrendingActivityItem() {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="mt-2 h-3 w-20" />
      <Skeleton className="mt-1.5 h-3 w-24" />
      <div className="mt-2 flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  )
}

export function FeedSidebar({ onNavigate }: FeedSidebarProps) {
  const [activities, setActivities] = useState<ActivityCardData[]>([])
  const [facilities, setFacilities] = useState<FacilityCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [actData, facData] = await Promise.allSettled([
          activitiesService.getAll({}),
          facilitiesService.getAll(),
        ])
        if (actData.status === "fulfilled" && Array.isArray(actData.value)) {
          setActivities(actData.value.map(mapActivity))
        }
        if (facData.status === "fulfilled" && Array.isArray(facData.value)) {
          setFacilities(facData.value.map(mapFacility))
        }
      } catch { } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const trendingActivities = activities.slice(0, 3)
  const topFacilities = facilities.slice(0, 2)

  return (
    <aside className="hidden w-96 shrink-0 border-l border-border bg-card xl:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        {/* Trending Activities */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <h3 className="text-sm font-semibold text-foreground">Trending Activities</h3>
          </div>
          <div className="space-y-2.5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <LoadingTrendingActivityItem key={i} />)
            ) : (
              trendingActivities.map((activity) => (
                <button
                  type="button"
                  key={activity.id}
                  onClick={() => onNavigate("activity-detail", activity.id)}
                  className="w-full rounded-xl border border-border bg-muted p-3 text-left transition-all hover:shadow-md hover:border-primary/30"
                >
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {activity.sport}
                  </span>
                  <p className="mt-1.5 text-xs font-semibold text-foreground line-clamp-2">{activity.title}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{activity.location}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="font-medium">{activity.rating}</span>
                      <span className="text-muted-foreground">({activity.reviews})</span>
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{activity.organizer}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                    <span className="text-xs font-bold text-secondary">
                      {activity.price === 0 ? "Free" : `${activity.currency}${activity.price}`}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {activity.spots} left
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Top Facilities */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Top Facilities</h3>
          </div>
          <div className="space-y-2.5">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                  <div className="mt-2 flex justify-between">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))
            ) : (
              topFacilities.map((facility) => (
                <button
                  type="button"
                  key={facility.id}
                  onClick={() => onNavigate("facility-detail", facility.id)}
                  className="w-full rounded-xl border border-border bg-muted p-3 text-left transition-all hover:shadow-md hover:border-primary/30"
                >
                  <p className="text-xs font-semibold text-foreground">{facility.name}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{facility.type}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="text-[10px] font-medium">{facility.rating}</span>
                    </div>
                    <span className="text-[10px] font-medium text-primary">
                      {facility.pricePerHour === 0 ? "Free" : `${facility.currency}${facility.pricePerHour}/hr`}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl bg-muted p-3">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Your Week</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
              <p className="text-lg font-bold text-primary">3</p>
              <p className="text-[10px] text-muted-foreground">Activities</p>
            </div>
            <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
              <p className="text-lg font-bold text-secondary">5.2</p>
              <p className="text-[10px] text-muted-foreground">Hours</p>
            </div>
            <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
              <p className="text-lg font-bold text-primary">2</p>
              <p className="text-[10px] text-muted-foreground">Sports</p>
            </div>
            <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
              <p className="text-lg font-bold text-secondary">12</p>
              <p className="text-[10px] text-muted-foreground">Streak Days</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
