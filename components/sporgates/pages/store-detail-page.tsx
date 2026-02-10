"use client"

import { useState } from "react"
import { ArrowLeft, Star, MapPin, Clock, BadgeCheck, ShoppingBag } from "lucide-react"
import { businesses, products, services } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface StoreDetailPageProps {
  businessId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

export function StoreDetailPage({ businessId, onNavigate }: StoreDetailPageProps) {
  const business = businesses.find((b) => b.id === businessId) || businesses[0]
  const [activeTab, setActiveTab] = useState("Products")

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("businesses")}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Businesses
      </button>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative h-40">
          <img
            src={business.image}
            alt={business.name}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="px-6 pb-6 pt-4">
          <div className="-mt-8 flex items-end gap-4">
            <div className="gradient-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-card text-lg font-bold text-white shadow-lg">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1 pt-10">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold text-foreground">{business.name}</h1>
                {business.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{business.type}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {business.rating} ({business.reviews} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Open now
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {["Products", "Services"].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Products" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {products.map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => onNavigate("product-detail", product.id)}
              className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                {product.originalPrice && (
                  <div className="absolute right-3 top-3 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <h3 className="text-sm font-bold text-foreground">{product.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === "Services" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in">
          {services.map((service) => (
            <button
              type="button"
              key={service.id}
              onClick={() => onNavigate("service-detail", service.id)}
              className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-16 w-16 rounded-xl object-cover"
                  crossOrigin="anonymous"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{service.name}</h3>
                  <p className="text-xs text-muted-foreground">{service.provider}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs">
                    <span className="font-bold text-primary">${service.price}</span>
                    <span className="text-muted-foreground">{service.duration}</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      {service.rating}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
