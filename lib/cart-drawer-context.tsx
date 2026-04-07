"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import { CartDrawer } from "@/components/sporgates/cart-drawer"
import { useAppRouter } from "@/lib/route-map"

interface CartDrawerContextValue {
  openCart: () => void
  closeCart: () => void
  isOpen: boolean
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null)

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { navigate } = useAppRouter()

  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({
      openCart,
      closeCart,
      isOpen: open,
    }),
    [open, openCart, closeCart]
  )

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      <CartDrawer open={open} onClose={closeCart} onNavigate={navigate} />
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer(): CartDrawerContextValue {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) {
    return {
      openCart: () => {},
      closeCart: () => {},
      isOpen: false,
    }
  }
  return ctx
}
