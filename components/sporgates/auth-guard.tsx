"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { STORAGE_KEYS } from "@/lib/constants"

/**
 * Client-side auth guard — fallback for the server middleware.
 * Checks localStorage for a valid token and redirects if missing.
 * Preserves callbackUrl so user returns to the page they were on after login.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (!token) {
            const signin = pathname && pathname !== "/" ? `/signin?callbackUrl=${encodeURIComponent(pathname)}` : "/signin"
            router.replace(signin)
        } else {
            setChecked(true)
        }
    }, [router, pathname])

    // Listen for auth:logout events (fired by api.ts on 401)
    useEffect(() => {
        const onLogout = () => router.replace("/signin")
        window.addEventListener("auth:logout", onLogout)
        return () => window.removeEventListener("auth:logout", onLogout)
    }, [router])

    if (!checked) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return <>{children}</>
}
