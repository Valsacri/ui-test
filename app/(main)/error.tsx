"use client"

import { useEffect } from "react"

export default function MainError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Route error:", error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <svg
                    className="h-8 w-8 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    An unexpected error occurred. Please try again or refresh the page.
                </p>
            </div>
            <button
                onClick={reset}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
                Try Again
            </button>
        </div>
    )
}
