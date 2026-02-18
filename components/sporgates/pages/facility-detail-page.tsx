"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, MapPin, Clock, Users, Loader2 } from "lucide-react"
import { facilitiesService } from "@/lib/services"
import { mapFacility, type FacilityCardData, type FacilityDto } from "@/lib/explore-api"
import type { PageRoute } from "@/lib/navigation"
import { BookingSidebar } from "@/components/sporgates/booking-sidebar"
import { MapView } from "@/components/sporgates/map-view"

interface FacilityDetailPageProps {
  facilityId: string
  onNavigate: (page: PageRoute) => void
}

export function FacilityDetailPage({ facilityId, onNavigate }: FacilityDetailPageProps) {
  const [facility, setFacility] = useState<FacilityCardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    facilitiesService
      .getById(facilityId)
      .then((data: FacilityDto) => {
        if (!cancelled) setFacility(mapFacility(data))
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load facility details.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [facilityId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !facility) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("facilities")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facilities
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-semibold text-foreground">Facility not found</p>
          <p className="mt-2 text-sm text-muted-foreground">{error || "The facility you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  const coordinates: [number, number] = facility.coordinates[0] !== 0
    ? facility.coordinates
    : [40.758, -73.985]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("facilities")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Facilities
      </button>

      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        {facility.image ? (
          <img src={facility.image} alt={facility.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {facility.type}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{facility.rating || "—"}</span>
                {facility.reviews > 0 && (
                  <span className="text-xs text-muted-foreground">({facility.reviews} reviews)</span>
                )}
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{facility.name}</h1>
            <p className="text-sm text-muted-foreground">
              {facility.description || "A premium facility with modern amenities and professional-grade equipment."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <MapPin className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground">{facility.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Hours</p>
                <p className="text-sm font-semibold text-foreground">{facility.hours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Capacity</p>
                <p className="text-sm font-semibold text-foreground">{facility.capacity || "N/A"} people</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Star className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Price</p>
                <p className="text-sm font-semibold text-foreground">
                  {facility.pricePerHour === 0 ? "Free" : `$${facility.pricePerHour}/hr`}
                </p>
              </div>
            </div>
          </div>

          {facility.amenities.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {facility.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {facility.sports.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Sports Available</h3>
              <div className="flex flex-wrap gap-2">
                {facility.sports.map((sport) => (
                  <span key={sport} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          )}

          <MapView center={coordinates} markerLabel={facility.location} />
        </div>

        <BookingSidebar
          pricePerHour={facility.pricePerHour}
          capacity={facility.capacity || 40}
          itemName={facility.name}
        />
      </div>
    </div>
  )
}
