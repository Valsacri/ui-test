"use client"

import { TrendingUp, Calendar, MapPin, Star } from "lucide-react"
import { activities, facilities } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"

interface FeedSidebarProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function FeedSidebar({ onNavigate }: FeedSidebarProps) {
  const trendingActivities = activities.slice(0, 3)
  const topFacilities = facilities.slice(0, 2)

  return (
    <aside className="hidden w-72 shrink-0 border-l border-border bg-card xl:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        {/* Trending Activities */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <h3 className="text-sm font-semibold text-foreground">Trending Activities</h3>
          </div>
          <div className="space-y-2.5">
            {trendingActivities.map((activity) => (
              <button
                type="button"
                key={activity.id}
                onClick={() => onNavigate("activity-detail", activity.id)}
                className="w-full rounded-xl bg-muted p-3 text-left transition-all hover:shadow-md"
              >
                <p className="text-xs font-semibold text-foreground">{activity.title}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{activity.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.location}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary">
                    {activity.price === 0 ? "Free" : `$${activity.price}`}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {activity.spots} spots left
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Facilities */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Top Facilities</h3>
          </div>
          <div className="space-y-2.5">
            {topFacilities.map((facility) => (
              <button
                type="button"
                key={facility.id}
                onClick={() => onNavigate("facility-detail", facility.id)}
                className="w-full rounded-xl bg-muted p-3 text-left transition-all hover:shadow-md"
              >
                <p className="text-xs font-semibold text-foreground">{facility.name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{facility.type}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <span className="text-[10px] font-medium">{facility.rating}</span>
                  </div>
                  <span className="text-[10px] font-medium text-primary">
                    {facility.pricePerHour === 0 ? "Free" : `$${facility.pricePerHour}/hr`}
                  </span>
                </div>
              </button>
            ))}
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
