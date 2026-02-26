"use client"

import Image from "next/image"
import { MapPin, Star, Clock, CheckCircle } from "lucide-react"

interface FacilityCardProps {
  facility: {
    id: string
    name: string
    type: string
    location: string
    rating: number
    reviews: number
    pricePerHour: number
    currency: string
    image: string
    amenities: string[]
    hours: string
    sports: string[]
    available: boolean
  }
  onClick?: () => void
}

export function FacilityCard({ facility, onClick }: FacilityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={facility.image || "/placeholder.svg"}
          alt={facility.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${facility.available
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
              }`}
          >
            {facility.available ? "Available" : "Fully Booked"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
            {facility.type}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-[11px] font-medium">{facility.rating}</span>
            <span className="text-[10px] text-muted-foreground">({facility.reviews})</span>
          </div>
        </div>
        <h3 className="mb-2 text-sm font-bold text-foreground">{facility.name}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{facility.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{facility.hours}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {facility.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              <CheckCircle className="h-2.5 w-2.5 text-primary" />
              {amenity}
            </span>
          ))}
          {facility.amenities.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              +{facility.amenities.length - 3}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-bold text-primary">
            {facility.pricePerHour === 0 ? "Free" : `${facility.currency}${facility.pricePerHour}/hr`}
          </span>
          <span className="gradient-primary rounded-full px-3 py-1 text-[10px] font-semibold text-white">
            Book Now
          </span>
        </div>
      </div>
    </button>
  )
}
