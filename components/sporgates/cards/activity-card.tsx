"use client"

import Image from "next/image"
import { Calendar, MapPin, Star, Users, Clock, Loader2 } from "lucide-react"
import { useState } from "react"
import { ParticipantsModal } from "@/components/sporgates/activities/participants-modal"

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
    isJoined?: boolean
  }
  onClick?: () => void
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const [showParticipants, setShowParticipants] = useState(false)
  
  const currentParticipants = activity.totalSpots - activity.spots

  const handleParticipantsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowParticipants(true)
  }

  return (
    <>
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={activity.image || "/placeholder.svg"}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {activity.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-secondary backdrop-blur-sm shadow-sm">
          {activity.price === 0 ? "Free" : `${activity.currency}${activity.price}`}
        </div>
        
        {activity.isJoined && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-primary/95 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Joined
          </div>
        )}
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
            <div className="relative gradient-primary flex h-6 w-6 items-center justify-center overflow-hidden rounded-full text-[9px] font-bold text-white">
              {activity.organizerAvatar && (activity.organizerAvatar.startsWith("/") || activity.organizerAvatar.startsWith("http")) ? (
                <Image
                  src={activity.organizerAvatar}
                  alt={activity.organizer}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{activity.organizer.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{activity.organizer}</span>
          </div>
          <div 
            className="flex items-center gap-1 text-xs hover:bg-primary/5 p-1 rounded transition-colors"
            onClick={handleParticipantsClick}
          >
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-primary hover:underline cursor-pointer">
              Participants ({currentParticipants}/{activity.totalSpots})
            </span>
          </div>
        </div>
      </div>
    </button>

    <ParticipantsModal 
      activityId={activity.id} 
      isOpen={showParticipants} 
      setIsOpen={setShowParticipants} 
      currentParticipants={currentParticipants} 
      maxParticipants={activity.totalSpots} 
    />
    </>
  )
}
