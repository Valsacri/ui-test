"use client"

import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Share2,
  Heart,
  CheckCircle,
} from "lucide-react"
import { activities } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"

interface ActivityDetailPageProps {
  activityId: string
  onNavigate: (page: PageRoute) => void
}

export function ActivityDetailPage({ activityId, onNavigate }: ActivityDetailPageProps) {
  const activity = activities.find((a) => a.id === activityId) || activities[0]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate("activities")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </button>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.title}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Heart className="h-5 w-5 text-foreground" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {activity.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {activity.sport}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{activity.rating}</span>
                <span className="text-xs text-muted-foreground">({activity.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{activity.title}</h1>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Date</p>
                <p className="text-sm font-semibold text-foreground">{activity.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Time</p>
                <p className="text-sm font-semibold text-foreground">{activity.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <MapPin className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground">{activity.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <Users className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Spots</p>
                <p className="text-sm font-semibold text-foreground">
                  {activity.spots} of {activity.totalSpots} available
                </p>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Organizer</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white">
                  {activity.organizerAvatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{activity.organizer}</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Verified Organizer</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Follow
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">
              Participants ({activity.totalSpots - activity.spots}/{activity.totalSpots})
            </h3>
            <div className="flex items-center -space-x-2">
              {["JR", "MJ", "SL", "AC", "EP", "CR", "JW"].slice(0, activity.totalSpots - activity.spots).map((avatar, i) => (
                <div
                  key={i}
                  className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
                >
                  {avatar}
                </div>
              ))}
              {activity.spots > 0 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground">
                  +{activity.spots}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {activity.price === 0 ? "Free" : `${activity.currency}${activity.price}`}
              </p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{activity.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{activity.time}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-foreground">{activity.spots} spots</span>
              </div>
            </div>
            <button
              type="button"
              className="gradient-primary mb-3 w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Join Activity
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Message Organizer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
