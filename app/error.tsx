"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global error:", error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    An unexpected error occurred. Please try again or refresh the page.
                </p>
            </div>
            <button
                onClick={reset}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
                <RefreshCcw className="h-4 w-4" />
                Try Again
            </button>
        </div>
    )
}
