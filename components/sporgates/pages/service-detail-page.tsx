"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, CheckCircle, CalendarDays, Loader2 } from "lucide-react"
import { servicesService } from "@/lib/services"
import { mapService, type ServiceCardData, type ServiceListingDto } from "@/lib/explore-api"
import type { PageRoute } from "@/lib/navigation"
import { ServiceBookingSidebar } from "@/components/sporgates/service-booking-sidebar"

interface ServiceDetailPageProps {
  serviceId: string
  onNavigate: (page: PageRoute) => void
}

export function ServiceDetailPage({ serviceId, onNavigate }: ServiceDetailPageProps) {
  const [service, setService] = useState<ServiceCardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    servicesService
      .getById(serviceId)
      .then((data: ServiceListingDto) => {
        if (!cancelled) setService(mapService(data))
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load service details.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [serviceId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
          <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
            {service.image ? (
              <img src={service.image} alt={service.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <CalendarDays className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

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
        </div>

        <ServiceBookingSidebar
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
