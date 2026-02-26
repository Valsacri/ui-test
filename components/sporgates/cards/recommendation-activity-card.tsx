"use client"

import Image from "next/image"
import { Calendar, MapPin, Users, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RecommendationActivityCardProps {
  id: string
  title: string
  sport: string
  location: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  level: "Beginner" | "Intermediate" | "Advanced"
  image?: string
  reason: string
  onJoin: (id: string) => void
  isJoined?: boolean
}

export function RecommendationActivityCard({
  id,
  title,
  sport,
  location,
  date,
  time,
  participants,
  maxParticipants,
  level,
  image,
  reason,
  onJoin,
  isJoined = false,
}: RecommendationActivityCardProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      {image && (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image src={image} alt={title} className="object-cover" fill sizes="80px" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground">{sport}</p>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {level}
          </Badge>
        </div>

        <div className="mb-2 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="truncate">{date} • {time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{participants}/{maxParticipants} joined</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-2 text-[11px] text-secondary">
            <span className="font-semibold">Why:</span> {reason}
          </p>
          <Button
            size="sm"
            className="h-7 text-[11px]"
            onClick={() => onJoin(id)}
            disabled={isJoined}
            variant={isJoined ? "outline" : "default"}
          >
            {isJoined ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                Joined
              </>
            ) : (
              "Join"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
