"use client"

import { AlertTriangle, RefreshCcw, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
    title?: string
    message?: string
    onRetry?: () => void
    variant?: "inline" | "full"
    className?: string
}

export function ErrorState({
    title = "Something went wrong",
    message = "An unexpected error occurred. Please try again.",
    onRetry,
    variant = "full",
    className,
}: ErrorStateProps) {
    const isNetworkError =
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("fetch") ||
        message.toLowerCase().includes("connect")

    const Icon = isNetworkError ? WifiOff : AlertTriangle

    if (variant === "inline") {
        return (
            <div
                className={cn(
                    "flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3",
                    className
                )}
            >
                <Icon className="h-5 w-5 shrink-0 text-destructive" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-destructive">{title}</p>
                    <p className="text-xs text-muted-foreground truncate">{message}</p>
                </div>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="shrink-0 rounded-full border border-destructive/30 px-3 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        Retry
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col items-center justify-center text-center py-16", className)}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <Icon className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Try Again
                </button>
            )}
        </div>
    )
}
