"use client"

import { useState } from "react"
import Image from "next/image"
import {
    ArrowLeft,
    ShoppingBag,
    MapPin,
    CreditCard,
    CheckCircle,
    Loader2,
    Trash2,
    Plus,
    Minus,
    Package,
    Truck,
} from "lucide-react"
import { toast } from "sonner"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { ordersService } from "@/lib/services/orders"
import { getApiErrorMessage } from "@/lib/api-errors"
interface CheckoutPageProps {
    onNavigate: (page: PageRoute, detailId?: string) => void
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
    const cart = useCart()
    const cartItems = cart?.items ?? []
    const cartTotal = cart?.cartTotal ?? 0
    const cartCount = cart?.cartCount ?? 0
    const updateQuantity = cart?.updateQuantity ?? (() => { })
    const removeItem = cart?.removeItem ?? (() => { })
    const clearCart = cart?.clearCart ?? (() => { })

    const [step, setStep] = useState<"review" | "shipping" | "confirm">("review")
    const [submitting, setSubmitting] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)

    const [shipping, setShipping] = useState({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        notes: "",
    })

    const shippingCost = cartTotal > 100 ? 0 : 9.99
    const total = cartTotal + shippingCost

    const canProceedToShipping = cartItems.length > 0
    const canProceedToConfirm =
        shipping.address.trim() !== "" &&
        shipping.city.trim() !== "" &&
        shipping.country.trim() !== ""

    const handlePlaceOrder = async () => {
        setSubmitting(true)
        try {
            const result = await ordersService.createOrder({
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                shippingAddress: shipping.address,
                shippingCity: shipping.city,
                shippingState: shipping.state,
                shippingPostalCode: shipping.postalCode,
                shippingCountry: shipping.country,
                notes: shipping.notes || undefined,
            })
            setOrderId(result?.id || result?.orderId || null)
            setOrderSuccess(true)
            clearCart()
            toast.success("Order placed successfully!")
        } catch (err: any) {
            console.error("Order failed:", err)
            toast.error(getApiErrorMessage(err, "Failed to place order. Please try again."))
        } finally {
            setSubmitting(false)
        }
    }

    // Order Success Screen
    if (orderSuccess) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-foreground">Order Placed!</h1>
                <p className="mb-1 text-sm text-muted-foreground">
                    Your order has been placed successfully.
                </p>
                {orderId && (
                    <p className="mb-6 text-xs text-muted-foreground">
                        Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
                    </p>
                )}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onNavigate("marketplace")}
                        className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                        Continue Shopping
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate("orders")}
                        className="gradient-primary rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
                    >
                        View orders
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => onNavigate("marketplace")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
                    <p className="text-sm text-muted-foreground">{cartCount} items in your cart</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
                {[
                    { id: "review", label: "Review", icon: ShoppingBag },
                    { id: "shipping", label: "Shipping", icon: Truck },
                    { id: "confirm", label: "Confirm", icon: CreditCard },
                ].map((s, idx) => {
                    const isActive = step === s.id
                    const isDone =
                        (s.id === "review" && (step === "shipping" || step === "confirm")) ||
                        (s.id === "shipping" && step === "confirm")
                    const Icon = s.icon
                    return (
                        <div key={s.id} className="flex items-center gap-2 flex-1">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                                    isActive
                                        ? "bg-primary text-white"
                                        : isDone
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-muted text-muted-foreground"
                                )}
                            >
                                {isDone ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <Icon className="h-4 w-4" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-semibold",
                                    isActive ? "text-primary" : isDone ? "text-emerald-600" : "text-muted-foreground"
                                )}
                            >
                                {s.label}
                            </span>
                            {idx < 2 && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 rounded-full",
                                        isDone ? "bg-emerald-200" : "bg-border"
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            {cartItems.length === 0 && !orderSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground/40" />
                    <h3 className="text-sm font-semibold text-foreground">Your cart is empty</h3>
                    <p className="mb-4 text-xs text-muted-foreground">Add some products to get started</p>
                    <button
                        type="button"
                        onClick={() => onNavigate("marketplace")}
                        className="gradient-primary rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Step: Review Cart */}
                        {step === "review" && (
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <h3 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
                                    <Package className="h-4 w-4 text-primary" />
                                    Order Items
                                </h3>
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex gap-4 rounded-xl border border-border bg-card p-3"
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="rounded-lg object-cover bg-muted"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                                                <p className="text-xs font-bold text-primary">${item.price.toFixed(2)}</p>
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
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={!canProceedToShipping}
                                        onClick={() => setStep("shipping")}
                                        className="gradient-primary rounded-xl px-8 py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                                    >
                                        Continue to Shipping
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step: Shipping */}
                        {step === "shipping" && (
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <h3 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Shipping Address
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={shipping.address}
                                            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                                            placeholder="123 Main Street, Apt 4B"
                                            className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={shipping.city}
                                                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                                placeholder="New York"
                                                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                                State / Province
                                            </label>
                                            <input
                                                value={shipping.state}
                                                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                                                placeholder="NY"
                                                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                                Postal Code
                                            </label>
                                            <input
                                                value={shipping.postalCode}
                                                onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                                                placeholder="10001"
                                                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                                Country <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={shipping.country}
                                                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                                                placeholder="United States"
                                                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                                            Order Notes (optional)
                                        </label>
                                        <textarea
                                            value={shipping.notes}
                                            onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                                            placeholder="Special delivery instructions..."
                                            rows={3}
                                            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none focus:border-primary resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep("review")}
                                        className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!canProceedToConfirm}
                                        onClick={() => setStep("confirm")}
                                        className="gradient-primary rounded-xl px-8 py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                                    >
                                        Review Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step: Confirm */}
                        {step === "confirm" && (
                            <div className="space-y-4">
                                {/* Items Summary */}
                                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                    <h3 className="mb-3 text-sm font-bold text-foreground">Order Summary</h3>
                                    <div className="space-y-2">
                                        {cartItems.map((item) => (
                                            <div key={item.productId} className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Summary */}
                                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                    <h3 className="mb-3 text-sm font-bold text-foreground flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-primary" />
                                        Shipping To
                                    </h3>
                                    <p className="text-sm text-foreground">{shipping.address}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {[shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(", ")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{shipping.country}</p>
                                    {shipping.notes && (
                                        <p className="mt-2 text-xs italic text-muted-foreground">
                                            Note: {shipping.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep("shipping")}
                                        className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={handlePlaceOrder}
                                        className="gradient-primary flex items-center gap-2 rounded-xl px-8 py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-4 w-4" />
                                                Place Order — ${total.toFixed(2)}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Order Total */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold text-foreground">Order Total</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
                                    <span className="font-semibold text-foreground">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-semibold text-foreground">
                                        {shippingCost === 0 ? (
                                            <span className="text-emerald-600">Free</span>
                                        ) : (
                                            `$${shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="border-t border-border pt-2">
                                    <div className="flex items-center justify-between text-base">
                                        <span className="font-bold text-foreground">Total</span>
                                        <span className="font-bold text-primary">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {shippingCost > 0 && (
                                <p className="mt-3 rounded-lg bg-blue-50/50 px-3 py-2 text-[11px] text-blue-600/80 border border-blue-100">
                                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
