"use client"

import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketplaceFilterSidebarProps {
  categories: string[]
  activeCategory: string
  priceRanges: string[]
  activePriceRange: string
  onCategoryChange: (category: string) => void
  onPriceRangeChange: (range: string) => void
}

const badges = ["Trending", "New", "On Sale", "Top Rated"]

export function MarketplaceFilterSidebar({
  categories,
  activeCategory,
  priceRanges,
  activePriceRange,
  onCategoryChange,
  onPriceRangeChange,
}: MarketplaceFilterSidebarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-slide-in-up">
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Marketplace Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  activeCategory === category
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Price Range</p>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onPriceRangeChange(range)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                  activePriceRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Quick Tags</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
