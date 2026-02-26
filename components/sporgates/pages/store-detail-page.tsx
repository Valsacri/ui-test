"use client"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ArrowLeft, Star, MapPin, Clock, BadgeCheck, ShoppingBag, Package, Wrench } from "lucide-react"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { businessesService } from "@/lib/services/businesses"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"

interface StoreDetailPageProps {
  businessId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

export function StoreDetailPage({ businessId, onNavigate }: StoreDetailPageProps) {
  const [activeTab, setActiveTab] = useState("Products")

  const { data: business, isLoading: loadingBiz } = useSWR(
    businessId ? `/businesses/${businessId}` : null,
    () => businessesService.getById(businessId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: products = [] } = useSWR(
    businessId ? `/businesses/${businessId}/products` : null,
    () => marketplaceService.getAll({ sellerId: businessId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: servicesData = [] } = useSWR(
    businessId ? `/businesses/${businessId}/services` : null,
    () => servicesService.getAll({ providerId: businessId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const services: any[] = Array.isArray(servicesData) ? servicesData : []

  const loading = loadingBiz

  if (loading) {
    return <DetailPageSkeleton />
  }

  if (!business) {
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
        <ErrorState
          title="Business not found"
          message="The business you're looking for doesn't exist or is currently unavailable."
          onRetry={() => onNavigate("businesses")}
        />
      </div>
    )
  }

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
          <Image
            src={business.coverImage || business.image || "/placeholder.svg"}
            alt={business.name || "Business"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="px-6 pb-6 pt-6">
          <div className="-mt-8 flex items-end gap-4">
            <div className="gradient-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-card text-lg font-bold text-white shadow-lg">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1 pt-10">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold text-foreground">{business.name}</h1>
                {business.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{business.type || business.category || "Business"}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location || business.address || "Location not set"}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {business.rating || "N/A"} ({business.reviews || 0} reviews)
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
          {products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-card p-12 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No products available</p>
              <p className="mt-1 text-xs text-muted-foreground">This store hasn&apos;t listed any products yet</p>
            </div>
          ) : (
            products.map((product: any) => (
              <button
                type="button"
                key={product.id}
                onClick={() => onNavigate("product-detail", product.id)}
                className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={product.image || product.coverImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.originalPrice && (
                    <div className="absolute right-3 top-3 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
                      Sale
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{product.brand || product.category || ""}</p>
                  <h3 className="text-sm font-bold text-foreground">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <span className="text-xs font-medium">{product.rating || "N/A"}</span>
                    <span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {activeTab === "Services" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in">
          {services.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-card p-12 text-center">
              <Wrench className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No services available</p>
              <p className="mt-1 text-xs text-muted-foreground">This store hasn&apos;t listed any services yet</p>
            </div>
          ) : (
            services.map((service: any) => (
              <button
                type="button"
                key={service.id}
                onClick={() => onNavigate("service-detail", service.id)}
                className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    width={64}
                    height={64}
                    className="rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground">{service.name}</h3>
                    <p className="text-xs text-muted-foreground">{service.provider || ""}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="font-bold text-primary">${service.price}</span>
                      <span className="text-muted-foreground">{service.duration || ""}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-secondary text-secondary" />
                        {service.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
