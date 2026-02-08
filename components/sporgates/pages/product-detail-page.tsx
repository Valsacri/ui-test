"use client"

import { ArrowLeft, Star, Package, ShieldCheck } from "lucide-react"
import { products } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { ProductOrderSidebar } from "@/components/sporgates/product-order-sidebar"

interface ProductDetailPageProps {
  productId: string
  onNavigate: (page: PageRoute) => void
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const product = products.find((item) => item.id === productId) || products[0]
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
          <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {product.brand}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
              </div>
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
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Seller</p>
                <p className="text-sm font-semibold text-foreground">{product.seller}</p>
              </div>
            </div>
          </div>
        </div>

        <ProductOrderSidebar
          productName={product.name}
          productImage={product.image}
          price={product.price}
          originalPrice={product.originalPrice}
          rating={product.rating}
          reviews={product.reviews}
          inStock={product.inStock}
        />
      </div>
    </div>
  )
}
