"use client"

import { Calendar, MapPin, Star, Users, Clock } from "lucide-react"

interface ActivityCardProps {
  activity: {
    id: string
    title: string
    sport: string
    date: string
    time: string
    location: string
    price: number
    currency: string
    spots: number
    totalSpots: number
    image: string
    rating: number
    reviews: number
    organizer: string
    organizerAvatar: string
    tags: string[]
  }
  onClick?: () => void
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          crossOrigin="anonymous"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {activity.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-secondary backdrop-blur-sm">
          {activity.price === 0 ? "Free" : `${activity.currency}${activity.price}`}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {activity.sport}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-[11px] font-medium">{activity.rating}</span>
            <span className="text-[10px] text-muted-foreground">({activity.reviews})</span>
          </div>
        </div>
        <h3 className="mb-2 text-sm font-bold text-foreground">{activity.title}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{activity.location}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gradient-primary flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white">
              {activity.organizerAvatar}
            </div>
            <span className="text-xs text-muted-foreground">{activity.organizer}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-primary">{activity.spots}</span>
            <span className="text-muted-foreground">left</span>
          </div>
        </div>
      </div>
    </button>
  )
}
