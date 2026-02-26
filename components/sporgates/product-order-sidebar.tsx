"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Package, Truck, Shield } from "lucide-react"

interface ProductOrderSidebarProps {
  productName: string
  productImage: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  inStock: boolean
  onAddToCart?: (quantity: number) => void
}

export function ProductOrderSidebar({
  productName,
  productImage,
  price,
  originalPrice,
  rating,
  reviews,
  inStock,
  onAddToCart,
}: ProductOrderSidebarProps) {
  const [quantity, setQuantity] = useState(1)
  const subtotal = useMemo(() => price * quantity, [price, quantity])
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + shipping

  return (
    <aside className="sticky top-20 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="flex gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted">
          <img src={productImage} alt={productName} className="h-full w-full object-cover" crossOrigin="anonymous" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{productName}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-secondary">★</span>
            <span>{rating}</span>
            <span>({reviews})</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-primary">${price}</p>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through">${originalPrice}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {inStock ? "In stock" : "Out of stock"}
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">Quantity</label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="rounded-full bg-muted px-2 text-sm font-semibold text-foreground"
          >
            -
          </button>
          <span className="flex-1 text-center text-sm font-semibold text-foreground">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!inStock}
            className="rounded-full bg-muted px-2 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">${price} x {quantity}</span>
          <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-semibold text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddToCart?.(quantity)}
        disabled={!inStock}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        Add to Cart
      </button>

      <div className="space-y-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5" />
          <span>Fast delivery in 2-3 days</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5" />
          <span>Buyer protection included</span>
        </div>
      </div>
    </aside>
  )
}
