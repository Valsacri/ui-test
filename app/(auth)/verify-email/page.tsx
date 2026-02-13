"use client"

import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { useAppRouter } from "@/lib/route-map"

export default function VerifyEmailRoute() {
    const { navigate } = useAppRouter()
    return <AuthPages page="verify-email" onNavigate={navigate} />
}
