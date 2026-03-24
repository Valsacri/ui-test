"use client"

import Image from "next/image"
import { Star, MapPin, Users, CalendarDays, BadgeCheck } from "lucide-react"

interface BusinessCardProps {
  business: {
    id: string
    name: string
    type: string
    location: string
    rating?: number
    reviews?: number
    image?: string
    followers?: number
    activities?: number
    verified?: boolean
  }
  onClick?: () => void
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  const rating = business.rating || 0
  const reviews = business.reviews || 0
  const followers = business.followers || 0
  const activities = business.activities || 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-36 overflow-hidden bg-muted/30">
        {business.image ? (
          <Image
            src={business.image || "/placeholder.svg"}
            alt={business.name}
            fill
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full gradient-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-white/40">
              {business.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-foreground">{business.name}</h3>
          {business.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
        </div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-secondary truncate">
          {business.type}
        </p>
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{business.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-xs font-medium">{rating > 0 ? rating : "—"}</span>
            {reviews > 0 && <span className="text-[10px] text-muted-foreground">({reviews})</span>}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {followers}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {activities}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
