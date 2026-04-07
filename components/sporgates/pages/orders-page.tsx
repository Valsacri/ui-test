"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import {
    ArrowLeft,
    Package,
    Loader2,
    MapPin,
    Calendar,
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { ErrorState } from "@/components/sporgates/ux/error-state"

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"

export interface OrderItemDto {
    productId: string
    productName: string
    quantity: number
    price: number
    image?: string
}

export interface OrderDto {
    id: string
    userId: string
    items: OrderItemDto[]
    totalAmount: number
    currency: string
    status: OrderStatus
    shippingAddress?: string
    shippingCity?: string
    shippingState?: string
    shippingPostalCode?: string
    shippingCountry?: string
    notes?: string
    createdAt?: string | number[]
    updatedAt?: string | number[]
}

function formatOrderDate(value: OrderDto["createdAt"]): string {
    if (value == null) return "—"
    if (typeof value === "string") {
        const d = new Date(value)
        return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
    }
    if (Array.isArray(value) && value.length >= 3) {
        const [y, m, day, h = 0, min = 0] = value
        const d = new Date(y, (m as number) - 1, day, h, min)
        return d.toLocaleString()
    }
    return "—"
}

const statusStyles: Record<OrderStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-sky-100 text-sky-800",
    SHIPPED: "bg-violet-100 text-violet-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-muted text-muted-foreground",
}

interface OrdersPageProps {
    onNavigate: (page: PageRoute, detailId?: string) => void
}

export function OrdersPage({ onNavigate }: OrdersPageProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const { data, error, isLoading, mutate } = useSWR<OrderDto[]>("/v1/orders/my-orders", fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    })

    const orders = useMemo(() => (Array.isArray(data) ? data : []), [data])

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => onNavigate("marketplace")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
                    aria-label="Back to marketplace"
                >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My orders</h1>
                    <p className="text-sm text-muted-foreground">Track and review your marketplace purchases</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Loading orders…</p>
                </div>
            ) : error ? (
                <ErrorState
                    title="Couldn’t load orders"
                    message="We couldn’t fetch your order history. Try again in a moment."
                    onRetry={() => mutate()}
                />
            ) : orders.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="When you buy something from the marketplace, your orders will appear here."
                    action={{
                        label: "Browse marketplace",
                        onClick: () => onNavigate("marketplace"),
                        variant: "primary",
                    }}
                />
            ) : (
                <ul className="space-y-4">
                    {orders.map((order) => {
                        const open = expandedId === order.id
                        const itemCount = order.items?.reduce((s, i) => s + (i.quantity ?? 0), 0) ?? 0
                        return (
                            <li
                                key={order.id}
                                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                            >
                                <button
                                    type="button"
                                    onClick={() => setExpandedId(open ? null : order.id)}
                                    className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/40"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-xs font-semibold text-foreground">
                                                {order.id}
                                            </span>
                                            <span
                                                className={cn(
                                                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                                                    statusStyles[order.status] ?? "bg-muted text-foreground"
                                                )}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatOrderDate(order.createdAt)}
                                            </span>
                                            <span>
                                                {itemCount} {itemCount === 1 ? "item" : "items"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <p className="text-lg font-bold text-primary">
                                            {(order.currency ?? "$") +
                                                (order.totalAmount != null ? order.totalAmount.toFixed(2) : "0.00")}
                                        </p>
                                        {open ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </button>

                                {open && (
                                    <div className="space-y-4 border-t border-border bg-muted/30 px-4 py-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Items
                                            </p>
                                            <ul className="space-y-3">
                                                {(order.items ?? []).map((line) => (
                                                    <li
                                                        key={`${order.id}-${line.productId}`}
                                                        className="flex gap-3 rounded-xl border border-border bg-card p-2"
                                                    >
                                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                            {line.image ? (
                                                                <Image
                                                                    src={line.image}
                                                                    alt={line.productName}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="56px"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center">
                                                                    <Package className="h-6 w-6 text-muted-foreground/40" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-foreground line-clamp-2">
                                                                {line.productName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Qty {line.quantity} ×{" "}
                                                                {(order.currency ?? "$") +
                                                                    (line.price != null ? line.price.toFixed(2) : "0")}
                                                            </p>
                                                        </div>
                                                        <p className="shrink-0 text-sm font-bold text-foreground">
                                                            {(order.currency ?? "$") +
                                                                (
                                                                    (line.price ?? 0) * (line.quantity ?? 1)
                                                                ).toFixed(2)}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {(order.shippingCity ||
                                            order.shippingCountry ||
                                            order.shippingAddress) && (
                                            <div>
                                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Shipping
                                                </p>
                                                <div className="flex gap-2 rounded-xl border border-border bg-card p-3 text-sm text-foreground">
                                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                    <div className="space-y-0.5">
                                                        {order.shippingAddress && <p>{order.shippingAddress}</p>}
                                                        <p>
                                                            {[order.shippingCity, order.shippingState, order.shippingPostalCode]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </p>
                                                        {order.shippingCountry && <p>{order.shippingCountry}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {order.notes && (
                                            <div>
                                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Notes
                                                </p>
                                                <p className="rounded-xl border border-border bg-card p-3 text-sm text-foreground">
                                                    {order.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
