"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { services as mockServices } from "@/lib/mock-data"
import { servicesService } from "@/lib/services"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface ServicesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const categories = ["All", "Training", "Recovery", "Wellness", "Coaching"]

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [services, setServices] = useState(mockServices)

  useEffect(() => {
    servicesService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) setServices(data)
    }).catch(() => { })
  }, [])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-sm text-muted-foreground">
          Book training, wellness, and recovery services
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search services..."
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeCategory === cat
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => onNavigate("service-detail", service.id)}
          />
        ))}
      </div>
    </div>
  )
}