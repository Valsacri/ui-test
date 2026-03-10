"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ==================== Grid-level skeletons ====================

export function JobCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="border-t border-border pt-2">
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    )
}

export function PersonCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>
    )
}

export function MessageItemSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-xl p-3">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    )
}

export function BusinessCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export function ServiceCardSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
        </div>
    )
}

export function NotificationSkeleton() {
    return (
        <div className="flex items-start gap-3 p-4 border-b border-border">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    )
}

/** Message thread loading: alternating left/right bubbles */
export function ConversationThreadSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={i % 2 === 0 ? "flex justify-start" : "flex justify-end"}>
                    <div className={cn("space-y-1", i % 2 === 0 ? "max-w-[70%]" : "max-w-[70%]")}>
                        <Skeleton className={cn("rounded-2xl py-3", i % 2 === 0 ? "h-12 w-48 rounded-bl-md" : "h-10 w-36 rounded-br-md ml-auto")} />
                        <Skeleton className={cn("h-3 w-10", i % 2 === 0 ? "" : "ml-auto")} />
                    </div>
                </div>
            ))}
        </div>
    )
}

/** Full conversation view loading: header + thread + input. Use until messages and conversation info are loaded. */
export function ConversationLoadingSkeleton() {
    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:h-[calc(100vh-5rem)]">
            {/* Header skeleton */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-14" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </div>
            {/* Message thread skeleton */}
            <div className="flex-1 overflow-y-auto p-4">
                <ConversationThreadSkeleton count={6} />
            </div>
            {/* Input area skeleton */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 flex-1 rounded-full" />
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                </div>
            </div>
        </div>
    )
}

// ==================== Page-level skeletons ====================

export function DetailPageSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-6 pb-20 lg:pb-0 animate-pulse", className)}>
            {/* Back button */}
            <Skeleton className="h-5 w-32" />
            {/* Hero */}
            <Skeleton className="h-64 w-full rounded-2xl md:h-80" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-40 rounded-2xl" />
                </div>
                {/* Sidebar */}
                <div className="space-y-4">
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function StorySkeleton() {
    return (
        <div className="relative flex h-[160px] w-[100px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
            <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
            <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
                <Skeleton className="h-10 w-10 rounded-full border-2 border-border" />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 flex h-12 items-end justify-center pb-2">
                <Skeleton className="h-3 w-16 rounded-full" />
            </div>
        </div>
    )
}

export function StoryFeedSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: count }).map((_, i) => (
                <StorySkeleton key={i} />
            ))}
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
            </div>
            {/* Table */}
            <Skeleton className="h-48 rounded-2xl" />
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Cover + avatar */}
            <div className="relative">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="absolute -bottom-8 left-6">
                    <Skeleton className="h-20 w-20 rounded-full border-4 border-background" />
                </div>
            </div>
            <div className="pt-10 space-y-3 px-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
            {/* Tab content */}
            <div className="flex gap-2">
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
            </div>
        </div>
    )
}
