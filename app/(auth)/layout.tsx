"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { APP_HOME_PATH, AUTH_COOKIE_NAME } from "@/lib/constants"

const ONBOARDING_PATHS = ["/choose-sports", "/set-goals", "/onboarding-confirmation"]

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("auth_token")
        const isOnboarding = pathname && ONBOARDING_PATHS.some((p) => pathname.startsWith(p))
        if (token && !isOnboarding) {
            document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
            router.replace(APP_HOME_PATH)
        } else {
            // Set auth cookie whenever user has token (including onboarding) so "Go to Home" works
            if (token) {
                document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
            }
            setReady(true)
        }
    }, [router, pathname])

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return <>{children}</>
}
