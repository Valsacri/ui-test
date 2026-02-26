"use client"

import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: {
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
    seller: string
  }
  onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg"
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
            {product.currency}{product.price.toFixed(2)}
          </span>
          {product.inStock && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <ShoppingCart className="h-3 w-3" />
              Add
            </span>
          )}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">Sold by {product.seller}</p>
      </div>
    </button>
  )
}
