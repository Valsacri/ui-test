"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ArrowLeft, Star, MapPin, Clock, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { facilitiesService } from "@/lib/services"
import { mapFacility, type FacilityCardData, type FacilityDto } from "@/lib/explore-api"
import type { PageRoute } from "@/lib/navigation"
import { BookingSidebar } from "@/components/sporgates/booking-sidebar"
import { MapView } from "@/components/sporgates/map-view"
import { cn } from "@/lib/utils"

interface FacilityDetailPageProps {
  facilityId: string
  onNavigate: (page: PageRoute) => void
}

export function FacilityDetailPage({ facilityId, onNavigate }: FacilityDetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { data: facility, error, isLoading } = useSWR(
    facilityId ? `/facilities/${facilityId}` : null,
    async () => {
      const data: FacilityDto = await facilitiesService.getById(facilityId)
      return mapFacility(data)
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  // Combine image and imageUrls into a single array
  const images = useMemo(() => {
    if (!facility) return []
    const allImages: string[] = []
    if (facility.image) allImages.push(facility.image)
    if (facility.imageUrls && Array.isArray(facility.imageUrls)) {
      facility.imageUrls.forEach((url) => {
        if (url && !allImages.includes(url)) allImages.push(url)
      })
    }
    return allImages
  }, [facility])

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (isLoading) {
    return <DetailPageSkeleton />
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

      {/* Image Carousel */}
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        {images.length > 0 ? (
          <>
            <Image
              src={images[activeImageIndex]}
              alt={`${facility.name} ${activeImageIndex + 1}`}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 66vw"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-foreground shadow-lg transition-all hover:bg-card hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-foreground shadow-lg transition-all hover:bg-card hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activeImageIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`${facility.name} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

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
          facilityId={facility.id}
          pricePerHour={facility.pricePerHour}
          capacity={facility.capacity || 40}
          itemName={facility.name}
        />
      </div>
    </div>
  )
}
