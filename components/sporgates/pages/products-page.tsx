"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Search, SlidersHorizontal, ShoppingBag, Loader2 } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { ProductCard } from "@/components/sporgates/cards/product-card"
import { ProductsFilterSidebar } from "@/components/sporgates/filters/products-filter-sidebar"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { LoadingGrid, LoadingProductCard } from "@/components/sporgates/ux/loading-cards"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { SortFilter } from "@/components/sporgates/filters/sort-filter"

interface ProductsPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const priceRanges = ["Any Price", "Under $50", "$50-$100", "$100-$200", "Over $200"]

export function ProductsPage({ onNavigate }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(9)
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [priceRange, setPriceRange] = useState("Any Price")
  const [sortBy, setSortBy] = useState("relevance")

  const { data: products = [], isLoading } = useSWR<any[]>('/v1/products', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((item: any) => item.category).filter(Boolean)))],
    [products]
  )

  const filteredProducts = useMemo(() => {
    let result = products.filter((product: any) => {
      const matchesQuery =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

      if (!matchesQuery || !matchesCategory) return false

      if (priceRange === "Under $50" && product.price >= 50) return false
      if (priceRange === "$50-$100" && (product.price < 50 || product.price > 100)) return false
      if (priceRange === "$100-$200" && (product.price < 100 || product.price > 200)) return false
      if (priceRange === "Over $200" && product.price <= 200) return false

      return true
    })

    if (sortBy !== "relevance") {
      result = [...result].sort((a: any, b: any) => {
        switch (sortBy) {
          case "price-low": return a.price - b.price
          case "price-high": return b.price - a.price
          case "rating": return (b.rating || 0) - (a.rating || 0)
          default: return 0
        }
      })
    }

    return result
  }, [products, searchQuery, categoryFilter, priceRange, sortBy])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Browse sports gear and essentials</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("marketplace")}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Back to Marketplace
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted",
            showFilters && "bg-primary text-primary-foreground border-primary"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {showFilters && (
        <ProductsFilterSidebar
          categories={categories}
          activeCategory={categoryFilter}
          priceRanges={priceRanges}
          activePriceRange={priceRange}
          onCategoryChange={setCategoryFilter}
          onPriceRangeChange={setPriceRange}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredProducts.length}</span> products found
        </p>
        <SortFilter
          value={sortBy}
          onValueChange={setSortBy}
          options={[
            { value: "relevance", label: "Sort by: Relevance" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "rating", label: "Rating" },
          ]}
        />
      </div>

      {isLoading ? (
        <LoadingGrid>
          <LoadingProductCard />
        </LoadingGrid>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No products found"
          description="Try adjusting your filters or search query"
          action={{
            label: "Clear Filters",
            onClick: () => {
              setSearchQuery("")
              setCategoryFilter("All")
              setPriceRange("Any Price")
            },
            variant: "secondary",
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(0, visibleCount).map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate("product-detail", product.id)}
              />
            ))}
          </div>
          {visibleCount < filteredProducts.length && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:shadow-md"
              >
                Show More ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
