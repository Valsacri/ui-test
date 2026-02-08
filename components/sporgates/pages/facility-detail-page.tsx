"use client"

import { ArrowLeft, Star, MapPin, Clock, Users } from "lucide-react"
import { facilities } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { BookingSidebar } from "@/components/sporgates/booking-sidebar"
import { MapView } from "@/components/sporgates/map-view"

interface FacilityDetailPageProps {
  facilityId: string
  onNavigate: (page: PageRoute) => void
}

export function FacilityDetailPage({ facilityId, onNavigate }: FacilityDetailPageProps) {
  const facility = facilities.find((item) => item.id === facilityId) || facilities[0]
  const amenities = facility.amenities || ["Parking", "Lockers", "WiFi", "Showers"]
  const description = facility.description || "A premium facility with modern amenities and professional-grade equipment."
  const coordinates = facility.coordinates || [40.758, -73.985] as [number, number]

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
        <img src={facility.image || "/placeholder.svg"} alt={facility.name} className="h-full w-full object-cover" />
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
                <span className="text-sm font-medium">{facility.rating}</span>
                <span className="text-xs text-muted-foreground">({facility.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{facility.name}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
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
                <p className="text-sm font-semibold text-foreground">{facility.capacity || 40} people</p>
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

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span key={amenity} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

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
