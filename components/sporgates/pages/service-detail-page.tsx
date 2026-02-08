"use client"

import { ArrowLeft, Star, CheckCircle, CalendarDays } from "lucide-react"
import { services } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { ServiceBookingSidebar } from "@/components/sporgates/service-booking-sidebar"

interface ServiceDetailPageProps {
  serviceId: string
  onNavigate: (page: PageRoute) => void
}

export function ServiceDetailPage({ serviceId, onNavigate }: ServiceDetailPageProps) {
  const service = services.find((item) => item.id === serviceId) || services[0]

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
            <img src={service.image || "/placeholder.svg"} alt={service.name} className="h-full w-full object-cover" />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {service.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{service.rating}</span>
                <span className="text-xs text-muted-foreground">({service.reviews} reviews)</span>
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
                <p className="text-sm font-semibold text-foreground">{service.duration}</p>
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
