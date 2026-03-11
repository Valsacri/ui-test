"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ArrowLeft, Star, CheckCircle, CalendarDays, MapPin, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { servicesService } from "@/lib/services"
import { bookingService } from "@/lib/services/booking"
import { mapService, type ServiceCardData, type ServiceListingDto } from "@/lib/explore-api"
import type { PageRoute } from "@/lib/navigation"
import { ServiceBookingSidebar } from "@/components/sporgates/service-booking-sidebar"
import { MapView } from "@/components/sporgates/map-view"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { cn } from "@/lib/utils"

interface ServiceDetailPageProps {
  serviceId: string
  onNavigate: (page: PageRoute) => void
}

export function ServiceDetailPage({ serviceId, onNavigate }: ServiceDetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { data: service, error, isLoading } = useSWR(
    serviceId ? `/services/${serviceId}` : null,
    async () => {
      const data: ServiceListingDto = await servicesService.getById(serviceId)
      return mapService(data)
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  // Combine image and imageUrls into a single array
  const images = useMemo(() => {
    if (!service) return []
    const allImages: string[] = []
    if (service.image) allImages.push(service.image)
    if (service.imageUrls && Array.isArray(service.imageUrls)) {
      service.imageUrls.forEach((url) => {
        if (url && !allImages.includes(url)) allImages.push(url)
      })
    }
    return allImages
  }, [service])

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  if (error || !service) {
    return (
      <ErrorState
        title="Service not found"
        message={error || "The service you're looking for doesn't exist."}
        onRetry={() => onNavigate("services")}
      />
    )
  }

  if (error || !service) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("services")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-semibold text-foreground">Service not found</p>
          <p className="mt-2 text-sm text-muted-foreground">{error || "The service you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("services")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Image Carousel */}
          <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[activeImageIndex]}
                  alt={`${service.name} ${activeImageIndex + 1}`}
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
                <CalendarDays className="h-16 w-16 text-muted-foreground/30" />
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
                    alt={`${service.name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {service.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{service.rating || "—"}</span>
                {service.reviews > 0 && (
                  <span className="text-xs text-muted-foreground">({service.reviews} reviews)</span>
                )}
              </div>
              {service.verified && <CheckCircle className="h-4 w-4 text-primary" />}
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{service.name}</h1>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>

          {service.offerings && service.offerings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-foreground">Offerings</h3>
              <div className="flex flex-wrap gap-2">
                {service.offerings.map((offering, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    <Check className="h-3 w-3 text-primary" />
                    <span>{offering}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold text-foreground">{service.duration || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Provider</p>
                <p className="text-sm font-semibold text-foreground">{service.provider}</p>
              </div>
            </div>
          </div>

          {service.address && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-bold text-foreground">Location</h3>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <MapView
                  center={[40.7128, -74.0060]} // Default to NYC, will be geocoded from address
                  markerLabel={service.address}
                  height="240px"
                  addressQuery={service.address}
                />
              </div>
              <p className="text-sm text-muted-foreground px-1">{service.address}</p>
            </div>
          )}
        </div>

        <ServiceBookingSidebar
          serviceId={serviceId}
          serviceName={service.name}
          serviceImage={service.image}
          provider={service.provider}
          price={service.price}
          duration={service.duration}
          rating={service.rating}
          reviews={service.reviews}
          verified={service.verified}
        />
      </div>
    </div>
  )
}
