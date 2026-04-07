"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { Search, ShoppingBag, SlidersHorizontal, ShoppingCart, Star } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { ProductCard } from "@/components/sporgates/cards/product-card"
import { MarketplaceFilterSidebar } from "@/components/sporgates/filters/marketplace-filter-sidebar"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { LoadingGrid, LoadingProductCard } from "@/components/sporgates/ux/loading-cards"

import { CollectionsModal } from "@/components/sporgates/business/collections-modal"
import { SortFilter } from "@/components/sporgates/filters/sort-filter"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useCartDrawer } from "@/lib/cart-drawer-context"

interface MarketplacePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
  isBusinessMode?: boolean
}

const categories = ["All", "Footwear", "Equipment", "Apparel", "Wearables", "Nutrition"]
const priceRanges = ["Any Price", "Under $50", "$50-$100", "$100-$200", "Over $200"]

export function MarketplacePage({ onNavigate, isBusinessMode = false }: MarketplacePageProps) {
  const router = useRouter()
  const { openCart } = useCartDrawer()
  const cart = useCart()
  const addItem = cart?.addItem
  const cartCount = cart?.cartCount ?? 0

  const [activeCategory, setActiveCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState("Any Price")

  const [showCollections, setShowCollections] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(9)

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("cart") === "open") {
      openCart()
      router.replace("/marketplace", { scroll: false })
    }
  }, [router, openCart])

  const { data: products = [], error, isLoading, mutate } = useSWR<any[]>('/v1/products', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false
      if (priceRange === "Under $50" && p.price >= 50) return false
      if (priceRange === "$50-$100" && (p.price < 50 || p.price > 100)) return false
      if (priceRange === "$100-$200" && (p.price < 100 || p.price > 200)) return false
      if (priceRange === "Over $200" && p.price <= 200) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !(p.brand && p.brand.toLowerCase().includes(q))
        ) return false
      }
      return true
    })

    // Sort
    if (sortBy !== "relevance") {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "newest":
            return Number(b.id) - Number(a.id)
          default:
            return 0
        }
      })
    }

    return result
  }, [products, activeCategory, priceRange, searchQuery, sortBy])

  // Compute brands from products
  const featuredBrands = useMemo(() => {
    if (!products || products.length === 0) return []

    // Group products by brand
    const brandMap = new Map<string, { count: number; ratings: number[] }>()

    products.forEach((product) => {
      const brand = product.brand
      if (!brand) return

      if (!brandMap.has(brand)) {
        brandMap.set(brand, { count: 0, ratings: [] })
      }

      const brandData = brandMap.get(brand)!
      brandData.count++
      if (product.rating !== undefined && product.rating !== null) {
        brandData.ratings.push(product.rating)
      }
    })

    // Convert to array and calculate average ratings
    return Array.from(brandMap.entries())
      .map(([brandName, data]) => {
        const avgRating =
          data.ratings.length > 0
            ? data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length
            : undefined

        return {
          id: brandName.toLowerCase().replace(/\s+/g, "-"),
          name: brandName,
          productCount: data.count,
          rating: avgRating ? Math.round(avgRating * 10) / 10 : undefined,
        }
      })
      .sort((a, b) => b.productCount - a.productCount) // Sort by product count descending
      .slice(0, 8) // Limit to top 8 brands
  }, [products])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Shop sports gear, equipment, and more
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isBusinessMode && (
            <button
              type="button"
              onClick={() => setShowCollections(true)}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Collections
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Browse Products
          </button>
          <button
            type="button"
            onClick={() => openCart()}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
            aria-label="Open shopping cart"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((p) => !p)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted",
            showFilters && "bg-primary text-primary-foreground border-primary"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {showFilters && (
        <MarketplaceFilterSidebar
          categories={categories}
          activeCategory={activeCategory}
          priceRanges={priceRanges}
          activePriceRange={priceRange}
          onCategoryChange={setActiveCategory}
          onPriceRangeChange={setPriceRange}
        />
      )}

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

      {/* Featured Brands */}
      {featuredBrands.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Featured Brands</h2>
            <button className="text-xs font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {featuredBrands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => {
                  // Filter products by brand when clicked
                  setSearchQuery(brand.name)
                }}
                className="group flex min-w-[140px] flex-col items-center justify-between rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {brand.productCount} {brand.productCount === 1 ? "product" : "products"}
                  </p>
                </div>
                {brand.rating !== undefined && (
                  <div className="mt-3 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-xs font-semibold text-foreground">{brand.rating}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
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
            { value: "newest", label: "Newest" },
          ]}
        />
      </div>

      {isLoading ? (
        <LoadingGrid>
          <LoadingProductCard />
        </LoadingGrid>
      ) : error ? (
        <ErrorState
          title="Couldn't load products"
          message="We ran into an issue fetching the marketplace items."
          onRetry={() => mutate()}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description="Try adjusting your filters or search query"
          action={{
            label: "Clear Filters",
            onClick: () => {
              setActiveCategory("All")
              setPriceRange("Any Price")
            },
            variant: "secondary",
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: typeof product.price === "number" ? product.price : Number(product.price),
                  sellerName: product.sellerName ?? product.seller,
                }}
                onOpenDetail={() => onNavigate("product-detail", product.id)}
                onAddToCart={
                  addItem
                    ? () => {
                        if (!product.inStock) return
                        addItem({
                          productId: String(product.id),
                          name: product.name,
                          price: typeof product.price === "number" ? product.price : Number(product.price),
                          image: product.image || "",
                          quantity: 1,
                        })
                        toast.success(`Added ${product.name} to cart`)
                      }
                    : undefined
                }
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

      <CollectionsModal open={showCollections} onClose={() => setShowCollections(false)} />
    </div>
  )
}
