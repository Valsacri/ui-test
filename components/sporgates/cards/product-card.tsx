"use client"

import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"

export interface ProductCardProduct {
  id: string
  name: string
  brand: string
  price: number
  currency: string
  rating: number
  reviews: number
  image: string
  category: string
  inStock: boolean
  /** Legacy / alternate field */
  seller?: string
  sellerName?: string
}

interface ProductCardProps {
  product: ProductCardProduct
  onOpenDetail?: () => void
  onAddToCart?: () => void
}

export function ProductCard({ product, onOpenDetail, onAddToCart }: ProductCardProps) {
  const sellerLabel = product.sellerName ?? product.seller ?? "Seller"

  return (
    <div className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg">
      <button
        type="button"
        onClick={onOpenDetail}
        className="block w-full text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative h-44 overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
              <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground">
                Out of Stock
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
            {product.brand}
          </p>
          <h3 className="mb-1 text-sm font-bold text-foreground">{product.name}</h3>
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-[11px] font-medium">{product.rating}</span>
            <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-primary">
              {product.currency}
              {typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Sold by {sellerLabel}</p>
        </div>
      </button>

      {product.inStock && onAddToCart && (
        <div className="border-t border-border px-4 pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToCart()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-secondary/90 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        </div>
      )}
    </div>
  )
}
