"use client"

import { Star, Clock, BadgeCheck } from "lucide-react"

interface ServiceCardProps {
  service: {
    id: string
    name: string
    provider: string
    providerAvatar: string
    duration: string
    price: number
    currency: string
    rating: number
    reviews: number
    image: string
    category: string
    verified: boolean
  }
  onClick?: () => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          crossOrigin="anonymous"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
          {service.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="mb-1.5 text-sm font-bold text-foreground">{service.name}</h3>
        <div className="mb-2 flex items-center gap-2">
          <div className="gradient-primary flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white">
            {service.providerAvatar}
          </div>
          <span className="text-xs text-muted-foreground">{service.provider}</span>
          {service.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-[11px] font-medium">{service.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{service.duration}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-bold text-primary">
            {service.currency}{service.price}
          </span>
          <span className="gradient-secondary rounded-full px-3 py-1 text-[10px] font-semibold text-white">
            Book
          </span>
        </div>
      </div>
    </button>
  )
}
