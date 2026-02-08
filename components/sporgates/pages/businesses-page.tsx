"use client"

import { Search } from "lucide-react"
import { businesses } from "@/lib/mock-data"
import { BusinessCard } from "@/components/sporgates/cards/business-card"
import type { PageRoute } from "@/lib/navigation"

interface BusinessesPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function BusinessesPage({ onNavigate }: BusinessesPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Businesses</h1>
        <p className="text-sm text-muted-foreground">
          Discover sports businesses, venues, and organizers
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search businesses..."
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onClick={() => onNavigate("business-detail", business.id)}
          />
        ))}
      </div>
    </div>
  )
}
