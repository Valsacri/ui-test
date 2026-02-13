"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            router.replace("/signin")
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
