"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AUTH_COOKIE_NAME } from "@/lib/constants"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("auth_token")
        if (token) {
            // Sync auth cookie so middleware allows the next request (avoids redirect loop)
            document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
            router.replace("/")
        } else {
            setReady(true)
        }
    }, [router])

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8">
                {children}
            </div>
        </div>
    )
}
