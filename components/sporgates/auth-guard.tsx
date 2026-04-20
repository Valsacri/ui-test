"use client"

/**
 * Client-side auth guard — with fake authentication, always renders children.
 * Fake user is automatically logged in, so no auth check is needed.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    // Always render children - fake user is always authenticated
    return <>{children}</>
}
