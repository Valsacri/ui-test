"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Auth error:", error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">Authentication Error</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Something went wrong during authentication. Please try again.
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
