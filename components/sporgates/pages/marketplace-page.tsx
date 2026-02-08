"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, ShoppingBag } from "lucide-react"
import { products } from "@/lib/mock-data"
import { ProductCard } from "@/components/sporgates/cards/product-card"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface MarketplacePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const categories = ["All", "Footwear", "Equipment", "Apparel", "Wearables", "Nutrition"]

export function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [cartCount] = useState(2)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Shop sports gear, equipment, and more
          </p>
        </div>
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
        >
          <ShoppingBag className="h-5 w-5 text-foreground" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4 text-foreground" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeCategory === cat
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onNavigate("product-detail", product.id)}
          />
        ))}
      </div>
    </div>
  )
}
