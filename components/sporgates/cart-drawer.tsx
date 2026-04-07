"use client"

import Image from "next/image"
import { ShoppingBag, X, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { PageRoute } from "@/lib/navigation"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function CartDrawer({ open, onClose, onNavigate }: CartDrawerProps) {
  const cart = useCart()
  const cartItems = cart?.items ?? []
  const cartTotal = cart?.cartTotal ?? 0
  const cartCount = cart?.cartCount ?? 0
  const updateQuantity = cart?.updateQuantity ?? (() => {})
  const removeItem = cart?.removeItem ?? (() => {})

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-foreground/40 transition-opacity"
        onClick={onClose}
        onKeyDown={() => {}}
        role="button"
        tabIndex={-1}
        aria-label="Close cart"
      />
      <div
        data-cart-drawer="panel"
        className="fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-md animate-slide-in-right flex-col bg-card shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Shopping cart</h2>
              <p className="text-xs text-muted-foreground">{cartCount} items</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-sm font-semibold text-foreground">Cart is empty</h3>
                <p className="text-xs text-muted-foreground">Add products from the marketplace</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 rounded-xl border border-border bg-card p-3"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
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
                        aria-label="Remove item"
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
                onClick={() => {
                  onClose()
                  onNavigate("checkout")
                }}
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
  )
}
