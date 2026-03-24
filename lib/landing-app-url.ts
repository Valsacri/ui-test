import { useMemo } from "react"

/**
 * Base URL for "Open App", "Sign In", "Get Started" links on the landing page.
 *
 * Defaults to same-origin (relative paths) so dev / qa / prod each keep auth on the
 * current host (e.g. dev.sporgates.com → /signin on dev, not app.sporgates.com).
 *
 * Set NEXT_PUBLIC_APP_ORIGIN (e.g. https://app.sporgates.com) only if marketing and
 * app are on different origins and you need absolute links.
 */
export function getAppBaseUrl(): string {
    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim()
    return origin ? origin.replace(/\/$/, "") : ""
}

/** Resolves app link base; same as getAppBaseUrl (kept for landing components). */
export function useAppBaseUrl(): string {
    return useMemo(() => getAppBaseUrl(), [])
}
