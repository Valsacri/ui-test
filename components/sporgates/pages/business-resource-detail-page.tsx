"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Package,
  DollarSign,
  CalendarDays,
  CheckCircle,
  ShieldCheck,
  Edit3,
  Trash2,
  Tag,
  Building2,
  Wrench,
} from "lucide-react"
import { facilitiesService } from "@/lib/services/facilities"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"
import type { PageRoute } from "@/lib/navigation"
import { ConfirmDialog } from "@/components/sporgates/ux/confirm-dialog"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type ResourceType = "facility" | "product" | "service"

interface BusinessResourceDetailPageProps {
  resourceId: string
  resourceType: ResourceType
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function BusinessResourceDetailPage({ resourceId, resourceType, onNavigate }: BusinessResourceDetailPageProps) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    const fetch = async () => {
      try {
        let result: any
        if (resourceType === "facility") result = await facilitiesService.getById(resourceId)
        else if (resourceType === "product") result = await marketplaceService.getById(resourceId)
        else result = await servicesService.getById(resourceId)
        if (!cancelled) setData(result)
      } catch {
        if (!cancelled) setError("Failed to load resource details.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [resourceId, resourceType])

  const goBack = () => onNavigate("business-resources", resourceType)
  const goEdit = () => onNavigate("edit-resource", `${resourceType}--${resourceId}`)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      if (resourceType === "facility") await facilitiesService.delete(resourceId)
      else if (resourceType === "product") await marketplaceService.delete(resourceId)
      else await servicesService.delete(resourceId)
      toast.success("Resource deleted successfully")
      goBack()
    } catch {
      toast.error("Failed to delete resource")
      setDeleting(false)
    }
  }

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Resource not found"
        message={error || "The resource you're looking for doesn't exist."}
        onRetry={goBack}
      />
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button type="button" onClick={goBack} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-semibold text-foreground">Resource not found</p>
          <p className="mt-2 text-sm text-muted-foreground">{error || "The resource you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  const images: string[] = []
  if (resourceType === "facility") {
    if (data.coverImage) images.push(data.coverImage)
    if (Array.isArray(data.imageUrls)) data.imageUrls.forEach((u: string) => { if (!images.includes(u)) images.push(u) })
  } else {
    if (data.image) images.push(data.image)
    if (Array.isArray(data.imageUrls)) data.imageUrls.forEach((u: string) => { if (!images.includes(u)) images.push(u) })
  }

  const name = data.name || "Untitled"
  const description = data.description || ""
  const rating = data.rating || 0
  const reviews = data.reviews || data.reviewCount || 0
  const category = data.category || ""
  const TypeIcon = resourceType === "facility" ? Building2 : resourceType === "product" ? Package : Wrench
  const typeLabel = resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button type="button" onClick={goBack} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Resources
      </button>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        {images.length > 0 ? (
          <img
            src={images[activeImage] || images[0]}
            alt={name}
            className="h-full w-full object-cover transition-opacity duration-300"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <TypeIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Image thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(idx)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activeImage === idx ? "border-primary ring-2 ring-primary/20" : "border-border opacity-70 hover:opacity-100"
              )}
            >
              <img src={img} alt={`${name} ${idx + 1}`} className="h-full w-full object-cover" crossOrigin="anonymous" />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title + badges */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {category && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{category}</span>
              )}
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{typeLabel}</span>
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  {reviews > 0 && <span className="text-xs text-muted-foreground">({reviews} reviews)</span>}
                </div>
              )}
              {(data.isVerified || data.verified) && <CheckCircle className="h-4 w-4 text-primary" />}
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{name}</h1>
            {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4">
            {resourceType === "facility" && (
              <>
                {(data.address || data.city) && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <MapPin className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Location</p>
                      <p className="text-sm font-semibold text-foreground">{[data.address, data.city].filter(Boolean).join(", ")}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold text-foreground">{data.pricePerHour ? `$${data.pricePerHour}/hr` : "Free"}</p>
                  </div>
                </div>
                {data.capacity != null && data.capacity > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Capacity</p>
                      <p className="text-sm font-semibold text-foreground">{data.capacity} people</p>
                    </div>
                  </div>
                )}
                {data.phoneNumber && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Phone</p>
                      <p className="text-sm font-semibold text-foreground">{data.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {resourceType === "product" && (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Price</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{data.currency || "$"}{data.price}</p>
                      {data.originalPrice != null && data.originalPrice > 0 && data.originalPrice !== data.price && (
                        <p className="text-xs text-muted-foreground line-through">{data.currency || "$"}{data.originalPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
                {data.brand && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <Tag className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Brand</p>
                      <p className="text-sm font-semibold text-foreground">{data.brand}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Stock</p>
                    <p className={cn("text-sm font-semibold", data.inStock !== false ? "text-green-600" : "text-destructive")}>
                      {data.inStock !== false ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
                {data.subcategory && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <Package className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Subcategory</p>
                      <p className="text-sm font-semibold text-foreground">{data.subcategory}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {resourceType === "service" && (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold text-foreground">{data.currency || "$"}{data.price}</p>
                  </div>
                </div>
                {data.duration && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Duration</p>
                      <p className="text-sm font-semibold text-foreground">{data.duration}</p>
                    </div>
                  </div>
                )}
                {data.providerName && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Provider</p>
                      <p className="text-sm font-semibold text-foreground">{data.providerName}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Facility: amenities */}
          {resourceType === "facility" && Array.isArray(data.amenities) && data.amenities.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {data.amenities.map((a: string) => (
                  <span key={a} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Facility: sports */}
          {resourceType === "facility" && Array.isArray(data.sports) && data.sports.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Sports</h3>
              <div className="flex flex-wrap gap-2">
                {data.sports.map((s: string) => (
                  <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Facility: grounds */}
          {resourceType === "facility" && Array.isArray(data.grounds) && data.grounds.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Floors / Grounds</h3>
              <div className="flex flex-wrap gap-2">
                {data.grounds.map((g: string) => (
                  <span key={g} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{g}</span>
                ))}
              </div>
            </div>
          )}

          {/* Facility: opening hours */}
          {resourceType === "facility" && data.openingHours && typeof data.openingHours === "object" && Object.keys(data.openingHours).length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Opening Hours</h3>
              <div className="space-y-2">
                {Object.entries(data.openingHours as Record<string, string>).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                    <span className="text-xs font-medium text-foreground">{day}</span>
                    <span className="text-xs font-semibold text-primary">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product: features */}
          {resourceType === "product" && Array.isArray(data.features) && data.features.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Features</h3>
              <div className="flex flex-wrap gap-2">
                {data.features.map((f: string) => (
                  <span key={f} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Service: offerings */}
          {resourceType === "service" && Array.isArray(data.offerings) && data.offerings.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Offerings</h3>
              <div className="flex flex-wrap gap-2">
                {data.offerings.map((o: string) => (
                  <span key={o} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{o}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: action panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{name}</p>
                <p className="text-[11px] text-muted-foreground">{typeLabel}{category ? ` - ${category}` : ""}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              {resourceType === "facility" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="text-sm font-bold text-foreground">{data.pricePerHour ? `$${data.pricePerHour}/hr` : "Free"}</span>
                </div>
              )}
              {resourceType === "product" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="text-sm font-bold text-foreground">{data.currency || "$"}{data.price}</span>
                </div>
              )}
              {resourceType === "service" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="text-sm font-bold text-foreground">{data.currency || "$"}{data.price}</span>
                  </div>
                  {data.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="text-sm font-semibold text-foreground">{data.duration}</span>
                    </div>
                  )}
                </>
              )}
              {rating > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                    <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={goEdit}
                className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                <Edit3 className="h-4 w-4" />
                Edit Resource
              </button>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
              >
                <Trash2 className="h-4 w-4" />
                Delete Resource
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${name}?`}
        description="This action cannot be undone. The resource will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
