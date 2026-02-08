"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, ShoppingBag, X, Trash2, Plus, Minus, Package } from "lucide-react"
import { products } from "@/lib/mock-data"
import { ProductCard } from "@/components/sporgates/cards/product-card"
import { MarketplaceFilterSidebar } from "@/components/sporgates/filters/marketplace-filter-sidebar"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { LoadingGrid, LoadingProductCard } from "@/components/sporgates/ux/loading-cards"
import { ResourceCarousel } from "@/components/sporgates/business/resource-carousel"
import { CollectionsModal } from "@/components/sporgates/business/collections-modal"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface MarketplacePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

const categories = ["All", "Footwear", "Equipment", "Apparel", "Wearables", "Nutrition"]
const priceRanges = ["Any Price", "Under $50", "$50-$100", "$100-$200", "Over $200"]

export function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [showCart, setShowCart] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState("Any Price")
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [showCollections, setShowCollections] = useState(false)
  const isLoading = false
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: "1", name: "Pro Basketball Shoes", price: 149.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", quantity: 1 },
    { productId: "4", name: "Smart Fitness Watch", price: 299.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop", quantity: 1 },
  ])

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false
    if (priceRange === "Under $50" && p.price >= 50) return false
    if (priceRange === "$50-$100" && (p.price < 50 || p.price > 100)) return false
    if (priceRange === "$100-$200" && (p.price < 100 || p.price > 200)) return false
    if (priceRange === "Over $200" && p.price <= 200) return false
    return true
  })

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
          <button
            type="button"
            onClick={() => setShowCollections(true)}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Browse Products
          </button>
          <button
            type="button"
            onClick={() => setShowCart(true)}
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

      <ResourceCarousel
        title="Curated Picks"
        icon={<Package className="h-4 w-4" />}
        resources={products.slice(0, 6).map((product) => ({
          id: product.id,
          name: product.name,
          type: product.category,
          price: product.price,
          image: product.image,
          businessName: product.seller,
        }))}
        selectedResources={selectedResources}
        onToggle={(id) =>
          setSelectedResources((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          )
        }
        colorScheme="orange"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredProducts.length}</span> products found
        </p>
        <select className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs outline-none">
          <option>Sort by: Relevance</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating</option>
          <option>Newest</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingGrid>
          <LoadingProductCard />
        </LoadingGrid>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onNavigate("product-detail", product.id)}
            />
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-foreground/40 transition-opacity"
            onClick={() => setShowCart(false)}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}
          />
          <div className="fixed bottom-0 right-0 top-0 z-[70] w-full max-w-md animate-slide-in-right bg-card shadow-2xl">
            <div className="flex h-full flex-col">
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Shopping Cart</h2>
                  <p className="text-xs text-muted-foreground">{cartCount} items</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  className="rounded-full p-2 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-5">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground/40" />
                    <h3 className="text-sm font-semibold text-foreground">Cart is empty</h3>
                    <p className="text-xs text-muted-foreground">Start adding products to your cart</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 rounded-xl border border-border bg-card p-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                          crossOrigin="anonymous"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs font-bold text-primary">${item.price}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-border"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-border"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <p className="text-sm font-bold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-border p-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold text-foreground">
                      {cartTotal > 100 ? "Free" : "$9.99"}
                    </span>
                  </div>
                  <div className="mb-4 flex items-center justify-between border-t border-border pt-2 text-base">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary">
                      ${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
                  >
                    Checkout
                  </button>
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Free shipping on orders over $100
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <CollectionsModal open={showCollections} onClose={() => setShowCollections(false)} />
    </div>
  )
}
