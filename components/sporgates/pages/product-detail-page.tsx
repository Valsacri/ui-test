"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Star, Package, ShieldCheck, ShoppingCart, Heart, Store, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { marketplaceService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"
import { ProductOrderSidebar } from "@/components/sporgates/product-order-sidebar"
import { cn } from "@/lib/utils"

interface ProductDetailPageProps {
  productId: string
  onNavigate: (page: PageRoute) => void
}

interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  currency?: string
  rating?: number
  reviews?: number
  image?: string
  imageUrls?: string[]
  category: string
  inStock?: boolean
  seller?: string
  description?: string
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    marketplaceService
      .getById(productId)
      .then((data: Product) => {
        if (!cancelled) {
          setProduct(data)
          setActiveImageIndex(0) // Reset to first image when product changes
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load product details.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [productId])

  // Combine image and imageUrls into a single array
  const images = useMemo(() => {
    if (!product) return []
    const allImages: string[] = []
    if (product.image) allImages.push(product.image)
    if (product.imageUrls && Array.isArray(product.imageUrls)) {
      product.imageUrls.forEach((url) => {
        if (url && !allImages.includes(url)) allImages.push(url)
      })
    }
    return allImages
  }, [product])

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  if (error || !product) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("marketplace")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-semibold text-foreground">Product not found</p>
          <p className="mt-2 text-sm text-muted-foreground">{error || "The product you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  const description = product.description || "High-performance gear crafted for athletes who want the best in class.";

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("marketplace")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Image Carousel */}
          <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImageIndex]}
                  alt={`${product.name} ${activeImageIndex + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-300"
                  crossOrigin="anonymous"
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
                <Package className="h-16 w-16 text-muted-foreground/30" />
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
                    alt={`${product.name} thumbnail ${idx + 1}`}
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
                {product.brand}
              </span>
              {product.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  {product.reviews !== undefined && product.reviews > 0 && (
                    <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                  )}
                </div>
              )}
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{product.name}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Package className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Category</p>
                <p className="text-sm font-semibold text-foreground">{product.category}</p>
              </div>
            </div>
            {product.seller && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Seller</p>
                  <p className="text-sm font-semibold text-foreground">{product.seller}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProductOrderSidebar
          productName={product.name}
          productImage={product.image || ""}
          price={product.price}
          originalPrice={product.originalPrice}
          rating={product.rating ?? 0}
          reviews={product.reviews ?? 0}
          inStock={product.inStock ?? true}
          onAddToCart={(quantity) => {
            toast.success(`Added ${quantity} × ${product.name} to cart`)
          }}
        />
      </div>
    </div>
  )
}
