"use client"

import { MapPin, Users, Star, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface PersonCardProps {
  person: {
    id: string
    name: string
    sport: string
    role: string
    location: string
    followers: number
    rating: number
    avatar: string
    verified: boolean
    bio: string
  }
  onClick?: () => void
}

export function PersonCard({ person, onClick }: PersonCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="gradient-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white">
          {person.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-bold text-foreground">{person.name}</h3>
            {person.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {person.sport}
            </span>
            <span className="text-[11px] text-muted-foreground">{person.role}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{person.bio}</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{person.location}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{person.followers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-secondary text-secondary" />
              <span className="font-medium">{person.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
