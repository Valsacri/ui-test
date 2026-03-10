import { useEffect, useState } from "react"

/**
 * Base URL for "Open App", "Sign In", "Get Started" links on the landing page.
 * On localhost we use relative paths (same origin). Otherwise we point to app.sporgates.com.
 */
export const APP_BASE_URL_PRODUCTION = "https://app.sporgates.com"

export function getAppBaseUrl(): string {
    if (typeof window === "undefined") return APP_BASE_URL_PRODUCTION
    const host = window.location.hostname
    if (host === "localhost" || host === "127.0.0.1") return ""
    return APP_BASE_URL_PRODUCTION
}

/** Hook so links update after mount (localhost → relative paths). */
export function useAppBaseUrl(): string {
    const [base, setBase] = useState(APP_BASE_URL_PRODUCTION)
    useEffect(() => {
        setBase(getAppBaseUrl())
    }, [])
    return base
}
